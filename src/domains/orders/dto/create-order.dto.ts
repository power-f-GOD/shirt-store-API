import { Expose } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    type: Object,
    description: 'Number or count of the shirt type.',
    example: <Record<string, OrderItemDto>>{
      Givenchy: { count: 2, name: 'Givenchy' },
      Amiri: { count: 5, name: 'Amiri' }
    },
    required: true
  })
  @Expose()
  @IsObject()
  @ValidateNested()
  items: Record<string, OrderItemDto>;
}
