import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  email: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  subject: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  body: string;
}
