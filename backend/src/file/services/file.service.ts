import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { FileDocument, Files } from '../schemas/files.schemas';
import { UpdateFileDTO, UploadFileDTO } from '../DTOS/files.dto';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(@InjectModel(Files.name) private filesModel: Model<FileDocument>) { }
  async getUserFile(userId: string) {
    const resp = await this.filesModel.find({ userOwner: userId });
    return resp;
  }
  async uploadInfoFile(data: UploadFileDTO) {
    await new this.filesModel({
      userOwner: data.userId,
      path: data.path,
      filename: data.filename,
      size: data.size,
    }).save();
  }
  async getImage(id: string) {
    const data = await this.filesModel.findById(id);
    return data;
  }
  async updateFileConfig(data: UpdateFileDTO) {
    console.log(data);
    await this.filesModel.updateOne({ _id: data.fileId }, { $set: { isPublic: Boolean(data.isPublic), userAccess: data.mailInvitacion } });
  }
}
