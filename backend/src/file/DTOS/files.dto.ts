import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDTO {
  @ApiProperty()
  fieldname: string;
  @ApiProperty()
  originalname: string;
  @ApiProperty()
  encoding: string;
  @ApiProperty()
  mimetype: string;
  @ApiProperty()
  destination: string;
  @ApiProperty()
  filename: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  size: number;
  @ApiProperty()
  userId: string;
}
