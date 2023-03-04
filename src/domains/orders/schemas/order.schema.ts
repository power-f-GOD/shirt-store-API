import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { OrderItem } from './order-item.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: OrderItem.name }])
  items: OrderItem[];

  @Prop()
  item_count: number;

  @Prop()
  actual_cost: number;

  @Prop()
  cost: number;

  @Prop()
  discount: number;

  @Prop({ type: Date, required: true })
  created_at: string;

  @Prop({ type: Date, required: true })
  updated_at: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
