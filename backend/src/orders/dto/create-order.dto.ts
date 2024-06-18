import { ApiProperty } from '@nestjs/swagger';
export class CreateOrderDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  cart: any[];
  @ApiProperty({
    required: true,
    type: Number,
  })
  userId: string;
  @ApiProperty({
    required: true,
    type: Number,
  })
  branch: string;
  @ApiProperty()
  date: string;
  @ApiProperty()
  schedule: any;
}
export class SearchOrderDto {
  @ApiProperty()
  startAt: string;
  @ApiProperty()
  endAt: string;
  @ApiProperty()
  branchName: string;
  @ApiProperty()
  serachWord: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  skip: number;
}
export class SearchUserOrderDto {
  @ApiProperty()
  startAt: string;
  @ApiProperty()
  endAt: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  limit: number;
  @ApiProperty()
  skip: number;
}
