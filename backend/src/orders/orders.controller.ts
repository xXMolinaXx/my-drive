import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, SearchOrderDto, SearchUserOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { IhttpResponse } from 'src/common/interface/httpResponse/httpResponse.interface';
import { SearchAvailableSchedulesDto } from './dto/search-available-schedules.dto';
import { IFindAllOrder } from 'src/common/interface/orders/findAllorder.interface';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
@ApiTags('orders')
@Controller('orders')
@UseGuards(ApiKeyGuard)
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
  @Post('/readBranchOrder')
  async findAll(@Body() body: SearchOrderDto): Promise<IhttpResponse> {
    try {
      return {
        message: '',
        success: true,
        data: { orders: await this.ordersService.findAll(body), amount: this.ordersService.findAllCount(body) },
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error en el sistema',
        success: true,
        statusCode: 500,
        error: 'ocurio un error',
      };
    }
  }
  @Post('/readUserOrder')
  async readUserOrder(@Body() body: SearchUserOrderDto): Promise<IhttpResponse> {
    try {
      return {
        message: '',
        success: true,
        data: { orders: await this.ordersService.findAllUser(body), amount: this.ordersService.findAllUserCount(body) },
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: 'Error en el sistema',
        success: true,
        statusCode: 500,
        error: 'ocurio un error',
      };
    }
  }
}
