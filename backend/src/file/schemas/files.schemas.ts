import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';

export type FileDocument = HydratedDocument<Files>;

@Schema({ timestamps: true })
export class Files {
  @Prop({ required: true })
  userOwner: SchemaMongoose.Types.ObjectId;
  @Prop({ type: String, required: true })
  path: string;
  @Prop({ type: String, required: true })
  filename: string;
  @Prop({ type: Number, required: true, default: 0 })
  size: number;
  @Prop({ type: Boolean, required: true, default: false })
  isPublic: false;
  @Prop({ type: [SchemaMongoose.Types.ObjectId], default: [] })
  userAccess: SchemaMongoose.Types.ObjectId[];
}
export const ShiftSchema = SchemaFactory.createForClass(Files);
