import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos';
import {
  LoggerService,
  NormalizeResponseService,
  UtilsService
} from 'src/shared/services';
import { BaseQueryDto, ErrorResponseDto } from 'src/shared/dtos';
import { Order } from './schemas';
import { AppDomainNamesEnum } from 'src/enums';
import { CustomAuthGuard } from 'src/shared/guards';

@ApiTags(AppDomainNamesEnum.ORDERS)
@UseGuards(CustomAuthGuard)
@Controller(AppDomainNamesEnum.ORDERS)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private response: NormalizeResponseService,
    private logger: LoggerService,
    private utils: UtilsService
  ) {
    this.logger.setContext(OrdersController.name);
  }

  @ApiOperation({ summary: 'Create a new order placed by `request` user.' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({ type: Order })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Post()
  async create(@Body() body: CreateOrderDto, @Req() request: Request) {
    this.logger.debug(
      `Creating order for user, "${
        request.user.username
      }", with payload: ${this.utils.prettify(body)}...`
    );

    try {
      const order = await this.ordersService.create(body, request.user);

      return this.response.success(
        order,
        `Order (with ID "#${order._id
          .toString()
          .slice(0, 8)
          .toUpperCase()}") successfully placed!📝😎`
      );
    } catch (e: any) {
      this.logger.error(e.message || e);
      throw this.response.error(e.message || e);
    }
  }

  @ApiOperation({ summary: 'Get all orders belonging to `request` user.' })
  @ApiFoundResponse({ type: Order, isArray: true })
  @ApiQuery({ type: BaseQueryDto })
  @Get()
  async getAll(@Req() request: Request<any, any, any, BaseQueryDto>) {
    this.logger.debug(`Getting orders for user, ${request.user.username}...`);

    try {
      return this.response.success(await this.ordersService.getAll(request));
    } catch (e: any) {
      this.logger.error(e.message || e);
      throw this.response.error(e.message || e);
    }
  }

  @ApiOperation({
    summary: 'Find an order by `id`.'
  })
  @ApiFoundResponse(NormalizeResponseService.getSuccessSchema(Order))
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    this.logger.debug(
      `Getting order with id, ${id}, for user, ${request.user.username}...`
    );

    try {
      return this.response.success(await this.ordersService.findOne(id));
    } catch (e: any) {
      this.logger.error(e.message || e);
      throw this.response.error(e.message || e);
    }
  }
}
