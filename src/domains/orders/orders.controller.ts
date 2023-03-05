import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos';
import {
  LoggerService,
  NormalizeResponseService,
  PrettifyService
} from 'src/shared/services';
import { BaseQueryDto, ErrorResponseDto } from 'src/shared/dtos';
import { Order } from './schemas';
import { AppDomainNamesEnum } from 'src/enums';

@ApiTags(AppDomainNamesEnum.ORDERS)
@Controller(AppDomainNamesEnum.ORDERS)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private response: NormalizeResponseService,
    private logger: LoggerService,
    private prettify: PrettifyService
  ) {}

  @ApiOperation({ summary: 'Create a new order placed by `request` user.' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({ type: Order })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Post()
  async create(@Body() body: CreateOrderDto, @Req() request: Request) {
    this.logger.debug(
      `Creating order for user, ${
        request.user.name
      }, with payload: ${this.prettify.pretty(body)}...`
    );

    try {
      return this.response.success(await this.ordersService.create(body));
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }

  @ApiOperation({ summary: 'Get all orders belonging to `request` user.' })
  @ApiFoundResponse({ type: Order, isArray: true })
  @Get()
  async findAll(@Req() request: Request<any, any, any, BaseQueryDto>) {
    this.logger.debug(`Getting orders for user, ${request.user.name}...`);

    try {
      return this.response.success(await this.ordersService.findAll(request));
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }

  @ApiOperation({
    summary: 'Get an order (by `id`) belonging to `request` user.'
  })
  @ApiFoundResponse({ type: Order })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    this.logger.debug(
      `Getting order with id, ${id}, for user, ${request.user.name}...`
    );

    try {
      return this.response.success(await this.ordersService.findOne(id));
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
