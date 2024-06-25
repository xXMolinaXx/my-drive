import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { EBRANCH } from 'src/common/enums/branch';

export type OrderDocument = HydratedDocument<Order>;
class ReservationDate {
  @Prop()
  date: number;
  @Prop()
  year: number;
  @Prop()
  month: number;
  @Prop()
  hour: number;
  @Prop()
  minute: number;
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
@Schema({ timestamps: true })
export class Order {
  @Prop()
  cart: Product[];
  @Prop()
  finalPayment: number;
  @Prop({ required: true })
  userId: SchemaMongoose.Types.ObjectId;
  @Prop({ required: true, type: String, enum: EBRANCH })
  branch: string;
  @Prop({ default: 'en espera', enum: ['en espera', 'pagada', 'terminada', 'cancelada', 'generacion pago on click', 'toma de muestra', 'agregacion del recibo', 'finalizada'] })
  status: string;
  @Prop()
  reservationDate: ReservationDate;
  @Prop()
  reservation: Date;
  @Prop({ type: Boolean, default: false })
  payed: boolean;
  @Prop({ type: String, default: '' })
  urlPayment: string;
  @Prop({ type: String, default: '' })
  imagePaymentName: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
