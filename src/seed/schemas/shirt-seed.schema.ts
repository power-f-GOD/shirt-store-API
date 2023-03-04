import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShirtSeedDocument = HydratedDocument<ShirtSeed>;

@Schema()
export class ShirtSeed {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: 8 })
  price: number;

  @Prop({ required: true, unique: true })
  image_url: string;
}

export const ShirtSeedSchema = SchemaFactory.createForClass(ShirtSeed);
