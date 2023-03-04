import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  _id: string;

  @Prop()
  item_count: number;

  @Prop()
  actual_cost: number;

  @Prop()
  cost: number;

  @Prop({ max: 1, min: 0 })
  discount: number;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'OrderItem' }])
  items: OrderItem[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  created_at: string;

  updated: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
