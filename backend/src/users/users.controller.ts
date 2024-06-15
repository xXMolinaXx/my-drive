import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { IhttpResponse } from 'src/common/interface/httpResponse/httpResponse.interface';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
import { SendMailDto } from './dto/send-mail.dto';
import { type } from 'os';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IhttpResponse> {
    try {
      await this.usersService.create(createUserDto);
      return {
        message: 'Usuario Creado',
        statusCode: 200,
        success: true,
      };
    } catch (error) {
      return {
        message: 'Error al crear usuario',
        statusCode: 500,
        success: false,
        error: error.toString(),
      };
    }
  }
  @Post('/sendNotRemeberPassword')
  async sendMail(@Body() body: SendMailDto): Promise<IhttpResponse> {
    try {
      await this.usersService.sendEmail(body.email, body.subject);
      return {
        message: 'Correo enviado',
        success: true,
        statusCode: 200,
      };
    } catch (error) {
      return {
        message: 'Error al enviar correo intentelo mas tarde',
        success: false,
        statusCode: 500,
        error: typeof error === 'string' ? error : 'Error al enviar correo',
      };
    }
  }
  @UseGuards(ApiKeyGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
