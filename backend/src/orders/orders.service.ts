import { Injectable } from '@nestjs/common';
import { CreateOrderDto, SearchOrderDto, SearchUserOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose, { Model } from 'mongoose';
import { SearchAvailableSchedulesDto } from './dto/search-available-schedules.dto';
import { Product } from 'src/products/schemas/products.schema';
import { ProductsService } from 'src/products/products.service';
import { IFindAllOrder } from 'src/common/interface/orders/findAllorder.interface';
import { skip } from 'node:test';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly productsService: ProductsService,
  ) {}
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

  async findAllCount({ startAt, endAt, branchName, serachWord, status }: SearchOrderDto) {
    const query: any = { createdAt: { $gte: new Date(startAt), $lte: new Date(endAt) }, branch: branchName };
    if (serachWord) query['user.fullName'] = { $regex: serachWord, $options: 'i' };
    if (status) query.status = status;
    return await this.orderModel.find(query).countDocuments();
  }
  async findAll({ startAt, endAt, branchName, serachWord, status, limit, skip }: SearchOrderDto) {
    const query: any = { createdAt: { $gte: new Date(startAt), $lte: new Date(endAt) }, branch: branchName };
    if (serachWord) query['user.fullName'] = { $regex: serachWord, $options: 'i' };
    if (status) query.status = status;
    return await this.orderModel
      .aggregate([
        {
          $match: query,
        },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'users',
            pipeline: [
              {
                $project: { identification: 1, fullName: 1, telphone: 1, DNI: 1 },
              },
            ],
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
      ])
      .limit(limit)
      .skip(skip)
      .exec();
  }
  async findAllUserCount({ startAt, endAt, status, userId }: SearchUserOrderDto) {
    const query: any = { createdAt: { $gte: new Date(startAt), $lte: new Date(endAt) }, _id: userId };
    if (status) query.status = status;
    return await this.orderModel.find(query).countDocuments();
  }
  async findAllUser({ startAt, endAt, status, limit, skip, userId }: SearchUserOrderDto) {
    const query: any = { createdAt: { $gte: new Date(startAt), $lte: new Date(endAt) }, userId: new mongoose.Types.ObjectId(userId) };
    if (status) query.status = status;
    return await this.orderModel.find(query).limit(limit).skip(skip).exec();
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

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.orderModel.updateOne({ _id: id }, { $set: { status: updateOrderDto.status, payed: updateOrderDto.isPayed } });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
