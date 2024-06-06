import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Roles } from 'src/auth/decorators/roles.decorator';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  userIdentification: string;
  @Prop()
  password: string;
  @Prop()
  fullName: string;
  @Prop({ default: 'client', type: String, enum: ['client', 'admin'], required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
