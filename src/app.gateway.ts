import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { WS_PORT } from 'src/constants';
import {
  LoggerService,
  NormalizeResponseService,
  PrettifyService,
  SocketServerService
} from 'src/utils/';
import { UsersService } from './domains/users/users.service';
import { User } from './domains/users/schemas';
// import { BadRequestTransformationFilter } from 'src/utils';

@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
// @UseFilters(BadRequestTransformationFilter)
@WebSocketGateway(WS_PORT, {
  cors: { origin: /localhost/i },
  transports: ['websocket', 'polling']
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    protected usersService: UsersService,
    protected response: NormalizeResponseService,
    protected socket: SocketServerService,
    protected logger: LoggerService,
    protected prettify: PrettifyService
  ) {
    this.logger.setContext(AppGateway.name);
  }

  afterInit(server: Server) {
    this.socket.server = server;
  }

  async handleConnection(socket: Socket) {
    const { access_token } = socket.handshake.auth || {
      access_token: undefined
    };

    try {
      const user: User = access_token
        ? await this.usersService.verify(access_token)
        : { _id: Math.random().toString(), name: '' };

      user.authenticated = !!user;
      this.socket.users.set(socket.id, user);
      this.socket.usersSocketIds.set(user._id, socket.id);
      socket.join(user._id!); // in case there are several instances of the same socket probably due to multiple connected devices, join the current/same user room

      // if (!user.name) {socket.emit('authentication', this.response.success(e, e.message || e));}
      this.logger.debug(
        `Sockets shook hands! <${this.prettify.pretty({
          user: user?.name || user?._id,
          socket: socket.id
        })}>`
      );

      return Promise.resolve({
        user,
        users: this.socket.users,
        usersSocketIds: this.socket.usersSocketIds
      });
    } catch (e: any) {
      socket.emit('authentication', this.response.error(e, e.message || e));
      setTimeout(() => socket.disconnect(true), 200);
      return Promise.resolve(undefined);
    }
  }

  handleDisconnect(socket: Socket) {
    socket.offAny();
    socket.disconnect();
    const user = this.socket.users.get(socket.id);

    if (user) {
      this.socket.usersSocketIds.delete(this.socket.users.get(socket.id)!._id);
    }

    this.socket.users.delete(socket.id);
    this.logger.debug(
      `Sockets called it a day! <${this.prettify.pretty({
        user: user?.name || user?._id,
        socket: socket.id
      })}>`
    );
  }
}
