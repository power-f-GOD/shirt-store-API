import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderItem } from '../schemas';

export class OrderItemDto implements Omit<OrderItem, 'order'> {
  @ApiProperty({
    type: 'string',
    description: 'Name of the shirt.',
    example: 'Givenchy',
    required: true
  })
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty({
    type: 'number',
    description: 'Number (or count) of the shirt type.',
    example: 5,
    required: true
  })
  @IsNumber()
  count: number;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsNumber()
  @IsOptional()
  actual_cost?: number;

  @IsNumber()
  @IsOptional()
  price?: number;
}
