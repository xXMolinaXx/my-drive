import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileDocument, Files } from '../schemas/files.schemas';
import { UploadFileDTO } from '../DTOS/files.dto';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(@InjectModel(Files.name) private markingModel: Model<FileDocument>) { }
  async uploadInfoFile(data: UploadFileDTO) {
    await new this.markingModel({
      userOwner: data.userId,
      path: data.path,
      filename: data.filename,
      size: data.size,
    }).save();
  }
}
