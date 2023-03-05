import { Expose } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    description:
      "A map of `item` names to `CreateOrderItemDto`. However, note that `name` in this context's `item` object is not so much required since the `item` `key` would be (or is) the `name` of the `item`.",
    properties: {
      '[item_name]': {
        $ref: '#/components/schemas/CreateOrderItemDto'
      }
    },
    example: <Record<string, CreateOrderItemDto>>{
      Givenchy: { count: 2 },
      Amiri: { count: 5 }
    },
    required: true
  })
  @Expose()
  @IsObject()
  @ValidateNested()
  items: Record<string, CreateOrderItemDto>;
}
