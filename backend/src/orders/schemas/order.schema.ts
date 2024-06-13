import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;
@Schema({ timestamps: true })
export class Order {
  @Prop()
  cart: Product[];
  @Prop()
  finalPayment: number;
  @Prop({ required: true, type: String })
  userId: SchemaMongoose.Types.ObjectId;
  @Prop({ required: true, type: String })
  branch: string;
}

class Product {
  @Prop()
  name: string;
  @Prop()
  price: number;
  @Prop()
  amount: number;
  @Prop()
  _id: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
