import { ApiProperty, PartialType, } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  fullName: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  email: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  telphone: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  DNI: string;
  @ApiProperty({
    required: true,
    type: Date,
  })
  bornAt: Date;
  @ApiProperty({
    required: true,
    type: String,
  })
  gender: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  password: string;
}
export class UpdateUserDto2 extends PartialType(CreateUserDto) {
  @ApiProperty({
    required: true,
    type: String,
  })
  role: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  store: string;
}
