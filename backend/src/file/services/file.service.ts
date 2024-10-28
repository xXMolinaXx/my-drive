import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { FileDocument, Files } from '../schemas/files.schemas';
import { mailInvitacion, UpdateFileDTO, UploadFileDTO } from '../DTOS/files.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(@InjectModel(Files.name) private filesModel: Model<FileDocument>, private readonly usersService: UsersService) { }
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
    if (data.mailInvitacion) {
      const user = await this.usersService.findByEmail(data.mailInvitacion);
      const { userAccess } = await this.filesModel.findOne({ _id: data.fileId });
      const usersIdcombination = [...userAccess, { email: user.email, userId: user._id }];
      if (user) {
        await this.filesModel.updateOne({ _id: data.fileId }, { $set: { userAccess: usersIdcombination } });
      } else {
        throw 'No exste ningun usuario';
      }
    } else if (data.isPublic) {
      await this.filesModel.updateOne({ _id: data.fileId }, { $set: { isPublic: data.isPublic } });
    }
  }
}
