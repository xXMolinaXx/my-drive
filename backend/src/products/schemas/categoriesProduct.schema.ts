import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type CategoriesProductDocument = HydratedDocument<CategoriesProduct>;
@Schema()
export class CategoriesProduct {
  @Prop()
  name: string;
}
export const CategoriesProductSchema = SchemaFactory.createForClass(CategoriesProduct);
