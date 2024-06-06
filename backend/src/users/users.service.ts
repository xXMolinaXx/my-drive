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
    const user = await this.userModel.findOne({ userIdentification: createUserDto.userIdentification });
    if (user) throw 'Ya existe un usuario con este nombre';
    const password = await this.hashPassword(createUserDto.password);
    await new this.userModel({ ...createUserDto, password }).save();
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ userIdentification: username });
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
