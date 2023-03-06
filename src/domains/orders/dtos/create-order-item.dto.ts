import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderItem } from '../schemas';

@ApiExtraModels()
export class CreateOrderItemDto implements Pick<OrderItem, 'count'> {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Name of the shirt.',
    example: 'Givenchy'
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  name?: string;

  @ApiProperty({
    type: 'number',
    description: 'Number (or count) of the shirt type.',
    example: 5,
    required: true
  })
  @IsNumber()
  count: number;

  cost?: number;

  actual_cost?: number;

  price?: number;
}
