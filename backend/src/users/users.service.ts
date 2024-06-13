import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/users.schemas';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async hashPassword(password) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) throw 'Ya existe un usuario con este nombre';
    const password = await this.hashPassword(createUserDto.password);
    await new this.userModel({
      bornAt: createUserDto.bornAt,
      DNI: createUserDto.DNI.trim(),
      email: createUserDto.email.trim(),
      fullName: createUserDto.fullName.trim(),
      gender: createUserDto.gender,
      telphone: '+504' + createUserDto.telphone.trim(),
      password,
    }).save();
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw 'No existe este usuario';
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
