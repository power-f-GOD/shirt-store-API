import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type ShirtSeedDocument = HydratedDocument<ShirtSeed>;

@Schema()
export class ShirtSeed {
  @ApiProperty({ type: String })
  _id?: string;

  @ApiProperty({ type: String })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ type: Number })
  @Prop({ required: true, default: 8 })
  price: number;

  @ApiProperty({ type: String })
  @Prop({ required: true, unique: true })
  image_url: string;
}

export const ShirtSeedSchema = SchemaFactory.createForClass(ShirtSeed);
