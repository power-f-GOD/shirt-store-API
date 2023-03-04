import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Order } from './order.schema';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema()
export class OrderItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  cost?: number;

  @Prop({ required: true })
  actual_cost?: number;

  @Prop({ default: 8 })
  price?: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  order?: Order;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
