import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import {
  LoggerService,
  NormalizeResponseService,
  SocketServerService,
  UtilsService
} from 'src/shared/services';
import { UsersService } from './domains/users/users.service';
import { User } from './domains/users/schemas';

@WebSocketGateway(undefined, {
  cors: { origin: /localhost:3000/i, credentials: false },
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
    protected utils: UtilsService
  ) {
    this.logger.setContext(AppGateway.name);
  }

  afterInit(server: Server) {
    this.socket.server = server;
  }

  async handleConnection(socket: Socket) {
    const { access_token } = (socket.handshake.auth || {
      access_token: undefined
    }) as { access_token: string | undefined };

    try {
      let user: User | null = access_token
        ? await this.usersService.verify(access_token)
        : null;

      if (!user?._id) {
        user = {
          ...user,
          _id: Math.random().toString(),
          username: ''
        };
      }

      user.authenticated = !!user.username;
      this.socket.users.set(socket.id, user);
      this.socket.usersSocketIds.set(user._id, socket.id);
      socket.join(user._id!); // in case there are several instances of the same socket probably due to multiple connected devices, join the current/same user room

      // if (!user.name) {socket.emit('authentication', this.response.success(e, e.message || e));}
      this.logger.debug(
        `Sockets shook hands! <${this.utils.prettify({
          user: user?.username || user?._id,
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
    const user = this.socket.users.get(socket.id);

    if (user) {
      this.socket.usersSocketIds.delete(this.socket.users.get(socket.id)!._id);
      socket.leave(user._id!);
    }

    this.socket.users.delete(socket.id);
    this.logger.debug(
      `Sockets called it a day! <${this.utils.prettify({
        user: user?.username || user?._id,
        socket: socket.id
      })}>`
    );
    setImmediate(() => socket.rooms.forEach((room) => socket.leave(room)));
  }
}
