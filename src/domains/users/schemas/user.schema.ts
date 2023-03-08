import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Order } from 'src/domains/orders/schemas';

import { AppDomainNamesEnum } from 'src/enums';

export type UserDocument = HydratedDocument<User>;

@ApiTags(AppDomainNamesEnum.USERS)
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
export class User {
  @ApiProperty({ type: String })
  _id?: string;

  @ApiProperty({ type: String })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ type: Date })
  created_at?: string;

  @ApiProperty({ type: Date })
  updated_at?: string;

  @ApiProperty({ type: Boolean })
  @Prop({ type: Boolean })
  authenticated?: boolean;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Order' }])
  orders?: Order[];
}

export const UserSchema = SchemaFactory.createForClass(User);
