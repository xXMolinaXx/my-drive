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
  @Prop({ required: true })
  password: string;
  @Prop()
  resetPassword: resetPassword;
}

export const UserSchema = SchemaFactory.createForClass(User);
