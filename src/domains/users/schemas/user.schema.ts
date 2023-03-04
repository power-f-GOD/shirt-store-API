import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at'
  }
})
export class User {
  _id?: string;

  @Prop({ required: true, unique: true })
  name: string;

  created_at?: string;

  authenticated?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
