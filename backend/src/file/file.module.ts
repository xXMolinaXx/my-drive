import { Module } from '@nestjs/common';
import { FilesController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShiftSchema, Files } from './schemas/files.schemas';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: Files.name, schema: ShiftSchema }]), UsersModule],
  controllers: [FilesController],
  providers: [FileService],
})
export class FileModule { }
