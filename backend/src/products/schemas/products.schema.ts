import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument ,Schema as SchemaMongoose } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
@Schema()
export class Product {
  @Prop()
  name: string;
  @Prop()
  price: number;
  @Prop()
  category: SchemaMongoose.Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
