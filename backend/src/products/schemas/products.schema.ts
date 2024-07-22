import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
@Schema()
export class Product {
  @Prop()
  codFact: string;
  @Prop()
  name: string;
  @Prop()
  nameComplete: string;
  @Prop()
  synonym: string;
  @Prop({ enum: ['test', 'profile'] })
  type: string;
  @Prop()
  discount: boolean;
  @Prop()
  price: number;
  @Prop()
  category: SchemaMongoose.Types.ObjectId;
  @Prop()
  recommendations: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
