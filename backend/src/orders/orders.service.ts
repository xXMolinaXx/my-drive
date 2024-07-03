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
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) { }
  async create(createOrderDto: CreateOrderDto) {
    const { yearBorn } = await this.usersService.findById(createOrderDto.userId);
    let discount: 'normal' | 'superSenior' | 'senior' = 'normal';
    const actualYear = new Date().getFullYear();
    if (actualYear - yearBorn > 80) discount = 'superSenior';
    else if (actualYear - yearBorn > 60) discount = 'senior';

    const resevationDate = new Date(createOrderDto.date);
    let totalToPay = 0;
    let totalDiscount = 0;
    for (let index = 0; index < createOrderDto.cart.length; index++) {
      const element = createOrderDto.cart[index];
      const product = await this.productsService.findOne(element._id);
      totalToPay += element.amount * product.price;
    }
    const priceWithoutDiscount = totalToPay;
    if (discount === 'senior') {
      totalToPay = totalToPay - totalToPay * 0.3;
      totalDiscount = priceWithoutDiscount * 0.3;
    } else if (discount === 'superSenior') {
      totalToPay = totalToPay - totalToPay * 0.4;
      totalDiscount = priceWithoutDiscount * 0.4;
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
      totalDiscount,
      totalWithoutDiscount: priceWithoutDiscount,
    }).save();
  }

  async findAllCount({ startAt, endAt, branchName, serachWord, status }: SearchOrderDto) {
    const query: any = { createdAt: { $gte: new Date(startAt), $lte: new Date(endAt) }, branch: branchName };
    if (serachWord) query['user.fullName'] = { $regex: serachWord, $options: 'i' };
    if (status) query.status = status;
    return await this.orderModel.find(query).countDocuments();
  }
  async findAll({ startAt, endAt, branchName, serachWord, status, limit, skip, advanceSearch, typeOfSearch }: SearchOrderDto) {
    let query: any = {
      branch: branchName,
    };
    if (typeOfSearch === 1) {
      query = {
        branch: branchName,
        reservation: { $gte: new Date(startAt), $lte: new Date(endAt) },
        status: { $nin: ['terminada', 'cancelada', 'finalizada'] },
      };
    } else if (typeOfSearch === 2) {
      query = {
        branch: branchName,
        status: { $in: ['finalizada', 'cancelada'] },
      };
    } else if (typeOfSearch === 3) {
      query = {
        branch: branchName,
        status: { $nin: ['terminada', 'cancelada', 'finalizada'] },
        payed: false,
      };
    } else if (advanceSearch) {
      query = { reservation: { $gte: new Date(startAt), $lte: new Date(endAt) }, branch: branchName };
      if (serachWord) {
        const ids = await this.usersService.findUser(serachWord);
        query = { reservation: { $gte: new Date(startAt), $lte: new Date(endAt) }, branch: branchName, userId: { $in: ids } };
      }
      if (status && status !== 'todo') query.status = status;
    }
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
                $project: { identification: 1, fullName: 1, telphone: 1, DNI: 1, email: 1 },
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
      .sort({ reservation: 1 })
      .exec();
  }
  async findAllUserCount({ startAt, endAt, status, userId }: SearchUserOrderDto) {
    const query: any = { /*createdAt: { $gte: new Date(startAt), $lte: new Date(endAt) },*/ _id: userId };
    if (status) query.status = status;
    return await this.orderModel.find({ userId: userId }).countDocuments();
  }
  async findAllUser({ startAt, endAt, status, limit, skip, userId }: SearchUserOrderDto) {
    const query: any = { /*createdAt: { $gte: new Date(startAt), $lte: new Date(endAt) },*/ userId: userId };
    // if (status) query.status = status;
    return await this.orderModel
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();
  }
  async findAvailablesSchedules(scheduleSelected: SearchAvailableSchedulesDto) {
    const selectDate = new Date(scheduleSelected.date);
    const schedulesAvailables = [];
    for (let index = 6; index < 10; index++) {
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
  async findOne(id: string) {
    return await this.orderModel.findById(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto);
    if (updateOrderDto.type === 4) {
      await this.orderModel.updateOne({ _id: id }, { $set: { imagePaymentName: updateOrderDto.urlPayment, isPayed: true, status: 'agregacion del recibo' } });
      return;
    }
    if (updateOrderDto.type === 3) {
      await this.orderModel.updateOne({ _id: id }, { $set: { status: 'generacion pago on click', urlPayment: updateOrderDto.urlPayment } });
      return;
    }
    if (updateOrderDto.type === 2) {
      await this.orderModel.updateOne({ _id: id }, { $set: { payed: updateOrderDto.isPayed } });
      return;
    }
    if (updateOrderDto.type === 1) {
      await this.orderModel.updateOne({ _id: id }, { $set: { status: updateOrderDto.status } });
      return;
    }
    await this.orderModel.updateOne({ _id: id }, { $set: { status: updateOrderDto.status, payed: updateOrderDto.isPayed, urlPayment: updateOrderDto.urlPayment } });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
