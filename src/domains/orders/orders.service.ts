import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';

import { BaseQueryDto } from 'src/shared/dtos';
import { ShirtSeed } from '../seed/schemas';
import { SeedService } from '../seed/seed.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order, OrderDocument } from './schemas';

@Injectable()
export class OrdersService {
  private shirtSeeds: Map<string, ShirtSeed> = new Map();

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private seedService: SeedService
  ) {
    (async () =>
      (await this.seedService.getShirts()).map((shirt) => {
        this.shirtSeeds.set(shirt.name, shirt);
      }))();
  }

  create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel(createOrderDto);

    return order.save();
  }

  async findAll({ user, query }: Request<any, any, any, BaseQueryDto>) {
    return await this.orderModel
      .find({ _id: user._id })
      .limit(query.count || 10)
      .skip(query.skip || 0)
      .exec();
  }

  async findOne(id: string) {
    return await this.orderModel.findById(id).exec();
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto);
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  computeDiscount(items: CreateOrderDto['items']) {
    const shirts = { ...items };
    const discount = 0.2;
    let cost = 0;
    let actual_cost = 0;

    for (const name in shirts) {
      const shirtSeed = this.shirtSeeds.get(name);
      const shirt = shirts[name];

      if (!shirtSeed) throw new Error(`Invalid shirt, "${name}".`);
      shirt.actual_cost = shirtSeed.price * shirt.count;
      shirt.cost = shirtSeed.price * shirt.count;
      // Deleting this props in order to reduce size of response payload
      delete (shirt as any).name;
      delete (shirt as any).count;
      shirts[name] = shirt;
      cost += shirt.cost;
      actual_cost = +cost.toFixed(2);
    }

    cost = +(cost * (1 - discount)).toFixed(2);

    return { discount, items: shirts, cost, actual_cost };
  }
}
