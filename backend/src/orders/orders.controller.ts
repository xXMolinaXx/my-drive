import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { IhttpResponse } from 'src/common/interface/httpResponse/httpResponse.interface';
import { SearchAvailableSchedulesDto } from './dto/search-available-schedules.dto';
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<IhttpResponse> {
    try {
      await this.ordersService.create(createOrderDto);
      return {
        message: 'Orden guardada',
        success: true,
        statusCode: 200,
      };
    } catch (error) {
      return {
        message: 'Error al guardar orden',
        success: false,
        error: error.toString(),
        statusCode: 500,
      };
    }
  }
  @Post('/readAvailableSchedules')
  async readAvailableSchedules(@Body() scheduleSelected: SearchAvailableSchedulesDto): Promise<IhttpResponse> {
    try {
      return {
        statusCode: 200,
        message: '',
        success: true,
        data: await this.ordersService.findAvailablesSchedules(scheduleSelected),
      };
    } catch (error) {
      return {
        message: 'Error al leer datos',
        success: false,
        error: error.toString(),
        statusCode: 500,
      };
    }
  }
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
