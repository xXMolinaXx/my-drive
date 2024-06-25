import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto {
  @ApiProperty()
  status: string;
  @ApiProperty()
  isPayed: boolean;
  @ApiProperty()
  urlPayment: string;
  @ApiProperty()
  type: number;
}
