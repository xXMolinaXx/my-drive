import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  userIdentification: string;
  @ApiProperty({ required: true, type: String })
  fullName: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  password: string;
}
