import { ApiProperty } from '@nestjs/swagger';
export class CreateOrderDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  totalAmount: number;
  @ApiProperty({
    required: true,
  })
  cart: any[];
}
