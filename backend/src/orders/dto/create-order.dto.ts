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
