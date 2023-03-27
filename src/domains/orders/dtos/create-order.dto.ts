import { Expose } from 'class-transformer';
import { IsObject } from 'class-validator';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { CreateOrderItemDto } from './create-order-item.dto';
import { Order } from '../schemas';

export class CreateOrderDto
  implements Pick<Partial<Order>, 'cost' | 'actual_cost' | 'discount'>
{
  @ApiProperty({
    description:
      "A map of `item_name`s to `CreateOrderItemDto`. However, note that `name` in this context's `item` object is not so much required since the `item` `key` would be (or is) the `name` of the `item`.",
    type: 'object',
    properties: {
      '[item_name]': { $ref: getSchemaPath(CreateOrderItemDto) }
    },
    example: <Record<string, CreateOrderItemDto>>{
      Givenchy: { count: 2 },
      Amiri: { count: 5 }
    },
    required: true
  })
  @Expose()
  @IsObject()
  items: Record<string, CreateOrderItemDto>;

  cost?: number;

  actual_cost?: number;

  discount?: number;

  item_count?: number;
}
