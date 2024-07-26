import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export class resetPassword {
  @Prop()
  password: string;
  @Prop()
  expire: Date;
}
@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true, default: '1' })
  telphone: string;
  @Prop({ required: true, default: '1' })
  DNI: string;
  @Prop({ required: true, default: new Date() })
  bornAt: Date;
  @Prop({ required: true, enum: ['hombre', 'mujer'], default: 'hombre' })
  gender: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: 'client', type: String, enum: ['client', 'admin', 'flebotomista'], required: true })
  role: string;
  @Prop({ default: 'ninguno', enum: ['ninguno', 'granja', 'tepeyac'], type: String })
  store: string;
  @Prop()
  resetPassword: resetPassword;
  @Prop({ type: Number, require: true, default: 1900 })
  yearBorn: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
