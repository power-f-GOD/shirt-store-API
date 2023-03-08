import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';

import { BaseQueryDto } from 'src/shared/dtos';
import { UtilsService } from 'src/shared/services';
import { SeedService } from '../seed/seed.service';
import { User } from '../users/schemas';
import { CreateOrderItemDto } from './dtos';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order, OrderDocument, OrderItem } from './schemas';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderDocument>,
    private seeds: SeedService,
    private utils: UtilsService
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const itemsToArray = Object.entries(createOrderDto.items).map(
      ([name, props]) => ({ ...props, name })
    );

    for (const item of itemsToArray) {
      if (!this.seeds.shirts.get(item.name)) {
        throw new Error(`Invalid item, "${item.name}".`);
      }
    }

    const orderItems = await this.orderItemModel.create(itemsToArray);
    const order = await this.orderModel.create({
      items: orderItems.map((item) => item._id),
      user: user._id
    });

    return order;
  }

  async getAll({
    user,
    query
  }: Request<any, any, any, BaseQueryDto>): Promise<Order[]> {
    return await this.orderModel
      .find({ _id: user._id })
      .limit(query.count || 10)
      .skip(query.skip || 0)
      .exec();
  }

  async findOne(id: string): Promise<Order | null> {
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
    let itemCount = 0;

    for (const name in items) {
      const shirtSeed = this.seeds.shirts.get(name);
      const item = items[name];

      if (!shirtSeed) throw new Error(`Invalid shirt, "${name}".`);

      if (item.count) {
        itemsToArray.push({ count: item.count, price: shirtSeed.price });
        itemCount += item.count;
      }

      actual_cost += shirtSeed.price * item.count;
    }

    const [firstDiscountedCost, secondDiscountedCost] = await Promise.all([
      this.computeDiscountedCostFirstWay(itemsToArray, actual_cost),
      this.computeDiscountedCostSecondWay(itemsToArray, actual_cost, itemCount)
    ]);
    const lowestPossibleDiscountedCost = Math.min(
      firstDiscountedCost,
      secondDiscountedCost
    );

    console.log({
      firstDiscountedCost,
      secondDiscountedCost,
      lowestPossibleDiscountedCost,
      actual_cost,
      itemsToArray
    });

    return {
      discount: +this.utils.formatNumber(
        (actual_cost - lowestPossibleDiscountedCost) / actual_cost,
        { maximumFractionDigits: 3 }
      ),
      actual_cost,
      cost: lowestPossibleDiscountedCost
    };
  }

  private computeDiscountedCostFirstWay(
    items: CreateOrderItemDto[],
    actualCost: number
  ) {
    if (items.length < 2) return Promise.resolve(actualCost);

    const price = items[0].price!;
    let restItemCount = 0;
    let discountedCost = 0;
    const itemCounts = items.map((item) => {
      restItemCount += item.count;
      return item.count;
    });

    while (itemCounts.length) {
      let lim = itemCounts.length - 1;
      let groupCount = 0;

      // We don't want to keep the loop running redundantly (since we know that one group of one shirt will cost the same always)
      if (lim < 1) break;

      for (let i = 0; i <= lim; i++) {
        // At this point, it's safe to say we've exhausted the list, hence do not proceed
        if (itemCounts[i] === undefined) break;

        if (itemCounts[i]) {
          groupCount++;
          itemCounts[i]--;
          restItemCount--; // This is crucial in calculating the cost of the rest shirts (which will all belong to 1 group of 1 shirt type/kind)
        }

        if (itemCounts[i] < 1) {
          itemCounts.splice(i, 1);
          // We don't want to skip/miss any `itemCount` at index, hence these lines
          i--;
          lim--;
        }
      }

      discountedCost +=
        groupCount > 1
          ? groupCount *
            price *
            (1 - this.getDiscountPerGroupCount(groupCount)!)
          : 0;
    }

    discountedCost += restItemCount * price;

    return Promise.resolve(
      +this.utils.formatNumber(discountedCost || actualCost)
    );
  }

  private computeDiscountedCostSecondWay(
    items: CreateOrderItemDto[],
    actualCost: number,
    itemCount: number
  ) {
    if (items.length < 2) return Promise.resolve(actualCost);

    let restItemCount = 0;
    const price = items[0].price!;
    let maxSingleItemCount = -Infinity;
    let discountedCost = 0;
    const sortedItemCounts = items
      .map((item) => {
        restItemCount += item.count;
        return item.count;
      })
      .sort((a, b) => {
        if (a > maxSingleItemCount) maxSingleItemCount = a;
        return b - a;
      });
    const maxGroupable = Math.min(Math.ceil(itemCount / maxSingleItemCount), 5);

    while (sortedItemCounts.length) {
      let lim = maxGroupable - 1;
      let groupCount = 0;

      // We don't want to keep the loop running redundantly (since we know that one group of one shirt will cost the same always)
      if (sortedItemCounts.length < 2) break;

      for (let i = 0; i <= lim; i++) {
        // At this point, it's safe to say we've exhausted the list, hence do not proceed
        if (sortedItemCounts[i] === undefined) break;

        if (sortedItemCounts[i]) {
          groupCount++;
          sortedItemCounts[i]--;
          restItemCount--; // This is crucial in calculating the cost of the rest shirts (which will all belong to 1 group of 1 shirt type/kind)
        }

        if (sortedItemCounts[i] < 1) {
          sortedItemCounts.splice(i, 1);
          // We don't want to skip/miss any `itemCount` at index, hence these lines
          i--;
          lim--;
        }
      }

      discountedCost +=
        groupCount > 1
          ? groupCount * price * (1 - this.getDiscountPerGroupCount(groupCount))
          : 0;
    }

    discountedCost += restItemCount * price;

    return Promise.resolve(
      +this.utils.formatNumber(discountedCost || actualCost)
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
