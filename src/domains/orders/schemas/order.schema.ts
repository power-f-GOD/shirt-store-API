import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/domains/users/schemas';

import { OrderItem } from './order-item.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
export class Order {
  @ApiProperty({ type: 'string' })
  _id: string;

  @ApiProperty({ type: 'number' })
  @Prop()
  item_count: number;

  @ApiProperty({ type: 'number' })
  @Prop()
  actual_cost: number;

  @ApiProperty({ type: 'number' })
  @Prop()
  cost: number;

  @ApiProperty({ type: 'number' })
  @Prop({ max: 1, min: 0 })
  discount: number;

  @ApiProperty({
    type: Array(OrderItem)
  })
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'OrderItem' }])
  items: OrderItem[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @ApiProperty({ type: 'string' })
  created_at: string;

  @ApiProperty({ type: 'string' })
  updated_at: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
