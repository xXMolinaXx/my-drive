import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { SearchAvailableSchedulesDto } from './dto/search-available-schedules.dto';
import { Product } from 'src/products/schemas/products.schema';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly productsService: ProductsService,
  ) { }
  async create(createOrderDto: CreateOrderDto) {
    const resevationDate = new Date(createOrderDto.date);
    let totalToPay = 0;
    for (let index = 0; index < createOrderDto.cart.length; index++) {
      const element = createOrderDto.cart[index];
      const product = await this.productsService.findOne(element._id);
      totalToPay += element.amount * product.price;
    }
    await new this.orderModel({
      ...createOrderDto,
      finalPayment: totalToPay,
      reservationDate: {
        date: resevationDate.getDate(),
        hour: createOrderDto.schedule.hour,
        minute: createOrderDto.schedule.minute,
        month: resevationDate.getMonth(),
        year: resevationDate.getFullYear(),
      },
      branch: String(createOrderDto.branch).toLowerCase(),
      reservation: resevationDate,
    }).save();
  }

  findAll() {
    return `This action returns all orders`;
  }
  async findAvailablesSchedules(scheduleSelected: SearchAvailableSchedulesDto) {
    const selectDate = new Date(scheduleSelected.date);
    const schedulesAvailables = [];
    for (let index = 6; index < 19; index++) {
      for (let index2 = 0; index2 < 60; index2 += 20) {
        const existOrder = await this.orderModel.findOne({
          'reservationDate.hour': index,
          'reservationDate.minute': index2,
          'reservationDate.date': selectDate.getDate(),
          'reservationDate.year': selectDate.getFullYear(),
          'reservationDate.month': selectDate.getMonth(),
          branch: String(scheduleSelected.branch).toLowerCase(),
        });
        if (!existOrder) schedulesAvailables.push({ hour: index, minute: index2 });
      }
    }
    return schedulesAvailables;
  }
  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
