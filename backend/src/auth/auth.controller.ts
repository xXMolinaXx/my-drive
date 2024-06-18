import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ERoles } from "./../common/enums/roles.enum";
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dto/login.dto';
import { IhttpResponse } from 'src/common/interface/httpResponse/httpResponse.interface';
import { RefreshToken } from './decorators/refreshToken.decorator';
import { ApiKeyGuard } from './guards/api-key.guard';
import { UserRefreshTokenDTO } from './DTOS/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: LoginDto): Promise<IhttpResponse> {
    try {
      return {
        message: 'Ingreso correctamente',
        statusCode: 200,
        success: true,
        data: await this.authService.signIn(signInDto.username, signInDto.password),
      };
    } catch (error) {
      return {
        message: 'Error al ingresar',
        statusCode: 500,
        success: false,
        error: error.toString(),
      };
    }
  }
  @Roles(ERoles.USER, ERoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @RefreshToken()
  @UseGuards(ApiKeyGuard, RolesGuard)
  @Post('/updateToken')
  async updateUserToken(@Body() params: UserRefreshTokenDTO): Promise<IhttpResponse> {
    try {
      return {
        message: 'ingreso con usuario correcto',
        success: true,
        data: await this.authService.generateNewJWT(params),
        statusCode: 201,
      };
    } catch (error) {
      return {
        message: 'Error al ingresar',
        error: error.toString(),
        success: true,
        statusCode: 500,
      };
    }
  }
}
