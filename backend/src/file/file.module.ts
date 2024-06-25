import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
@Module({
  controllers: [FilesController],
})
export class FileModule {}
