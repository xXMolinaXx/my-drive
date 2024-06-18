import { ApiProperty } from '@nestjs/swagger';

export class UserRefreshTokenDTO {
  @ApiProperty()
  _id: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  email: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  role: string;
}
