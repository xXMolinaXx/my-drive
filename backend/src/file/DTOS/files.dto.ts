import { ApiProperty, PartialType } from '@nestjs/swagger';

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
export class UpdateFileDTO {
  @ApiProperty()
  isPublic: string;
  @ApiProperty()
  mailInvitacion: string;
  @ApiProperty()
  fileId: string;
}
export class mailInvitacion {
  @ApiProperty()
  email: string;
  @ApiProperty()
  userId: string;
}
