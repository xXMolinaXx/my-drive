import { Controller, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { IhttpResponse } from '../common/interface/httpResponse/httpResponse.interface';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { SendMailDto } from './dto/send-mail.dto';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Public } from './../auth/decorators/public.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(ApiKeyGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
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
  @Public()
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
  @Public()
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<IhttpResponse> {
    try {
      await this.usersService.update(id, updateUserDto);
      return {
        message: 'Contraseña actualizada',
        success: true,
        statusCode: 200,
      };
    } catch (error) {
      return {
        message: 'error al actualizar contraseña',
        success: false,
        statusCode: 500,
        error: typeof error === 'string' ? error : 'Ocurrio un error al cambiar la contraseña',
      };
    }
  }
}
