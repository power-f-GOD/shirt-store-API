import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WsException
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { WS_PORT } from 'src/constants';
import { OrdersService } from './orders.service';
import { GatewayDto } from 'src/commons/dtos';
import { GatewayEventsEnum, GatewayPathsEnum } from 'src/enums';
import { AppGateway } from 'src/app.gateway';
import {
  DTOValidatorService,
  LoggerService,
  NormalizeResponseService,
  PrettifyService,
  SocketServerService
} from 'src/utils';
import { UsersService } from '../users/users.service';
import { ComputeDiscountDto } from './dto';

// @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
// @UseFilters(BadRequestTransformationFilter)
@WebSocketGateway(WS_PORT)
export class OrdersGateway extends AppGateway {
  constructor(
    protected logger: LoggerService,
    private ordersService: OrdersService,
    protected usersService: UsersService,
    protected response: NormalizeResponseService,
    protected socket: SocketServerService,
    protected dtoValidator: DTOValidatorService,
    protected prettify: PrettifyService
  ) {
    super(usersService, response, socket, logger, prettify);
    this.logger.setContext(OrdersGateway.name);
  }

  @SubscribeMessage(GatewayEventsEnum.ORDER)
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    payload: GatewayDto<unknown>
  ) {
    this.logger.debug(
      `Computing order discount with payload, ${this.prettify.pretty(payload)}`
    );

    switch (payload.path) {
      case GatewayPathsEnum.COMPUTE_DISCOUNT: {
        const data = payload.data as ComputeDiscountDto;

        // Augment payload to pass validation
        // for (const name in data.items) data.items[name].name = name;
        await this.dtoValidator.gateway(ComputeDiscountDto, data);

        try {
          console.log(socket.id, '...DDD');
          socket.emit(
            GatewayEventsEnum.ORDER,
            this.response.success(
              this.ordersService.computeDiscount(data.items),
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
