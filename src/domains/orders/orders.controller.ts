import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req
} from '@nestjs/common';
import { Request } from 'express';

import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import {
  LoggerService,
  NormalizeResponseService,
  PrettifyService
} from 'src/utils';
import { BaseQueryDto } from 'src/commons/dtos';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private response: NormalizeResponseService,
    private logger: LoggerService,
    private prettify: PrettifyService
  ) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
