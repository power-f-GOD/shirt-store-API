import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Order } from '../schemas';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto implements Pick<Order, 'items'> {
  @ApiProperty({
    type: Array,
    description: 'Number or count of the shirt type.',
    example: <OrderItemDto[]>[
      { count: 2, name: 'Givenchy' },
      { count: 5, name: 'Amiri' }
    ],
    required: true
  })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
