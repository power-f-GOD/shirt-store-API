import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WsException
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { OrdersService } from './orders.service';
import { GatewayDto } from 'src/shared/dtos';
import { GatewayEventsEnum, GatewayPathsEnum } from 'src/enums';
import { AppGateway } from 'src/app.gateway';
import {
  DTOValidatorService,
  LoggerService,
  NormalizeResponseService,
  UtilsService,
  SocketServerService
} from 'src/shared/services';
import { UsersService } from '../users/users.service';
import { ComputeDiscountDto } from './dtos';

@WebSocketGateway()
export class OrdersGateway extends AppGateway {
  constructor(
    protected logger: LoggerService,
    private ordersService: OrdersService,
    protected usersService: UsersService,
    protected response: NormalizeResponseService,
    protected socket: SocketServerService,
    protected dtoValidator: DTOValidatorService,
    protected utils: UtilsService
  ) {
    super(usersService, response, socket, logger, utils);
    this.logger.setContext(OrdersGateway.name);
  }

  @SubscribeMessage(GatewayEventsEnum.ORDER)
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: GatewayDto<unknown>
  ) {
    this.logger.debug(
      `Computing order discount with payload, ${this.utils.prettify(payload)}`
    );

    switch (payload.path) {
      case GatewayPathsEnum.COMPUTE_DISCOUNT: {
        const data = payload.data as ComputeDiscountDto;

        await this.dtoValidator.gateway(ComputeDiscountDto, data);

        try {
          socket.emit(
            GatewayEventsEnum.ORDER,
            this.response.success(
              await this.ordersService.computeDiscount(data.items),
              null,
              payload.path
            )
          );
        } catch (e: any) {
          this.logger.debug(e);
          throw new WsException(e.message || e);
        }
      }
    }
  }
}
