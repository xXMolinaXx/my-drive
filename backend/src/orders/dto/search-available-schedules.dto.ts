import { ApiProperty } from '@nestjs/swagger';
export class SearchAvailableSchedulesDto {
  @ApiProperty()
  date: string;
  @ApiProperty()
  branch: string;
}
