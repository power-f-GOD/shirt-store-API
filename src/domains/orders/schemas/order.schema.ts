import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { OrderItem } from './order-item.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
export class Order {
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: OrderItem.name }])
  items: OrderItem[];

  @Prop()
  item_count: number;

  @Prop()
  actual_cost: number;

  @Prop()
  cost: number;

  @Prop({ max: 1, min: 0 })
  discount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
