import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserRefreshTokenDTO } from './DTOS/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneByEmail(username.toLowerCase());
    if (!user) throw 'Este usuario no existe';
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw 'contraseña incorrecto';
    }
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const payload = { sub: user._id, username: user.fullName, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role,
      _id: user._id,
      userIdentification: user.DNI,
      yearBorn: user.yearBorn,
      fullName: user.fullName,
      store: user.store,
    };
  }
  async generateNewJWT(user: UserRefreshTokenDTO) {
    const payload = {
      username: user.email,
      sub: user._id,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
