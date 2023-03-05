import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

import { AppDomainNamesEnum } from 'src/enums';

export type UserDocument = HydratedDocument<User>;

@ApiTags(AppDomainNamesEnum.USERS)
@Schema({
  timestamps: {
    createdAt: 'created_at'
  }
})
export class User {
  @ApiProperty({ type: String })
  _id?: string;

  @ApiProperty({ type: String })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ type: Date })
  created_at?: string;

  authenticated?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
