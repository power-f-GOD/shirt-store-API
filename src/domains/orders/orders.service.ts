import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';

import { BaseQueryDto } from 'src/shared/dtos';
import { UtilsService } from 'src/shared/services';
import { ShirtSeed } from '../seed/schemas';
import { SeedService } from '../seed/seed.service';
import { CreateOrderItemDto } from './dtos';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order, OrderDocument } from './schemas';

@Injectable()
export class OrdersService {
  private shirtSeeds: Map<string, ShirtSeed> = new Map();

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private seedService: SeedService,
    private utils: UtilsService
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

  async computeDiscount(
    items: CreateOrderDto['items']
  ): Promise<Omit<Required<CreateOrderDto>, 'items'>> {
    const itemsToArray: CreateOrderItemDto[] = [];
    let actual_cost = 0;

    for (const name in items) {
      const shirtSeed = this.shirtSeeds.get(name);
      const item = items[name];

      if (!shirtSeed) throw new Error(`Invalid shirt, "${name}".`);

      if (item.count) {
        itemsToArray.push({ count: item.count, price: shirtSeed.price });
      }

      actual_cost += shirtSeed.price * item.count;
    }

    const [firstDiscountedCost] = await Promise.all([
      this.getDiscountedCostFirstWay(itemsToArray, actual_cost)
    ]);

    // console.log({ firstDiscountedCost, actual_cost });
    // console.log({ itemsToArray });
    return {
      discount: +this.utils.formatNumber(
        (actual_cost - firstDiscountedCost) / actual_cost,
        { maximumFractionDigits: 2 }
      ),
      actual_cost,
      cost: firstDiscountedCost
    };
  }

  private getDiscountedCostFirstWay(
    _items: CreateOrderItemDto[],
    actual_cost: number
  ) {
    const items = _items.map((item) => ({ ...item }));

    if (items.length < 2) return Promise.resolve(actual_cost);

    const price = items[0].price;
    let discountedCost = 0;

    while (items.length > 0) {
      let lim = items.length - 1;
      let groupCount = 0;

      for (let i = 0; i <= lim; i++) {
        if (items[i]?.count) {
          groupCount++;
          items[i].count--;
        } else {
          items.splice(i, 1);
          i--;
          lim = items.length - 1;
        }

        if (!items[i]) break;
      }

      discountedCost += groupCount
        ? groupCount * price! * (1 - this.getDiscountPerGroupCount(groupCount)!)
        : 0;
    }

    return Promise.resolve(
      +this.utils.formatNumber(discountedCost || actual_cost)
    );
  }

  private getDiscountPerGroupCount(groupCount: number) {
    switch (groupCount) {
      case 5:
        return 0.2;
      case 4:
        return 0.15;
      case 3:
        return 0.1;
      case 2:
        return 0.05;
      default:
        return 0;
    }
  }
}
