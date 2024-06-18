import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'credenciales de logeo',
    required: true,
    type: String,
  })
  username: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  password: string;
}
