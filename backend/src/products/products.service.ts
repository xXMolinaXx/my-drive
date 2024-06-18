import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/products.schema';
import { CategoriesProduct } from './schemas/categoriesProduct.schema';
import { join } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(CategoriesProduct.name) private categoriesProductModel: Model<CategoriesProduct>,
  ) {}
  // async create(createProductDto: CreateProductDto) {
  //   const productModel = this.productModel;
  //   const categoriesProduct = this.categoriesProductModel;
  //   const workbook = new ExcelJS.Workbook();
  //   const categories: any = [];
  //   const products = [];
  //   let categoryName: any = '';
  //   workbook.xlsx.readFile(join(process.cwd(), `/productos1.xlsx`)).then(function () {
  //     const worksheet = workbook.getWorksheet(1);
  //     worksheet.eachRow((row, i) => {
  //       if (row.getCell(1).value !== row.getCell(2).value) {
  //         categoriesProduct
  //           .findOne({ name: categoryName })
  //           .then((document) =>
  //             new productModel({
  //               name: row.getCell(3).value,
  //               price: row.getCell(4).value,
  //               category: document._id,
  //             })
  //               .save()
  //               .catch((e) => console.log(`producto ${e.toString()} ${row.getCell(3).value}`)),
  //           )
  //           .catch((e) => console.log(e.toString()));
  //         products.push();
  //       } else {
  //         categoryName = row.getCell(1).value;
  //       }
  //     });
  //     // categories.forEach(category=>{
  //     //   new categoriesProduct({
  //     //     name: category.name,
  //     //   }).save().catch(e=>console.log(e.toString(),category.name));
  //     // });
  //   });
  // }

  findAll({ skip = 0, limit = 25, searchWord = '' }) {
    if (searchWord !== 'ninguno') {
      return this.productModel
        .find({ name: { $regex: searchWord, $options: 'i' } })
        .skip(skip)
        .limit(limit)
        .exec();
    }
    return this.productModel.find().skip(skip).limit(limit).exec();
  }
  findAllCount(searchWord) {
    if (searchWord !== 'ninguno') {
      return this.productModel.find({ name: { $regex: searchWord, $options: 'i' } }).countDocuments();
    }
    return this.productModel.find().countDocuments();
  }

  async findOne(id: string) {
    return await this.productModel.findById(id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
