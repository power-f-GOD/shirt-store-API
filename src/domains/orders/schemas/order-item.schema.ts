import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Order } from './order.schema';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema()
export class OrderItem {
  @ApiProperty({ type: String })
  _id?: string;

  @ApiProperty({ type: String })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ type: Number })
  @Prop({ required: true })
  count: number;

  @ApiProperty({ type: Number })
  @Prop({ required: true })
  cost?: number;

  @ApiProperty({ type: Number })
  @Prop({ required: true })
  actual_cost?: number;

  @ApiProperty({ type: Number })
  @Prop({ default: 8 })
  price?: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Order',
    required: true
  })
  order: Order;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
