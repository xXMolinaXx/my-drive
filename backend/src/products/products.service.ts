import { Injectable, Logger } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/products.schema';
import { CategoriesProduct } from './schemas/categoriesProduct.schema';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ILCManswer } from 'src/common/interface/products/lcmQueryResponse';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(CategoriesProduct.name) private categoriesProductModel: Model<CategoriesProduct>,
    private readonly httpService: HttpService,
  ) { }
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
        .aggregate([
          {
            $lookup: {
              from: 'categoriesproducts',
              localField: 'category',
              foreignField: '_id',
              as: 'categories',
            },
          },
          { $match: { name: { $regex: searchWord, $options: 'i' } } },
        ])
        .skip(skip)
        .limit(limit);
    }
    return this.productModel
      .aggregate([
        {
          $lookup: {
            from: 'categoriesproducts',
            localField: 'category',
            foreignField: '_id',
            as: 'categories',
          },
        },
      ])
      .skip(skip)
      .limit(limit);
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
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateProducts() {
    this.logger.debug('**********Actualizando productos**********')
    const { data } = await firstValueFrom(
      this.httpService.get<ILCManswer>('https://lcm.clinsis.com/LCMLabTestCatalog').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );
    if (data.error) {
      throw 'Error no tenemos acceso al sistema de catalogo de lcm';
    } else {
      for (let index = 0; index < data.data.length; index++) {
        const el = data.data[index];
        const category = await this.categoriesProductModel.findOne({ name: el?.test_type?.description });
        if (!category) await new this.categoriesProductModel({ name: el?.test_type?.description }).save();
      }
      for (let index = 0; index < data.data.length; index++) {
        try {
          console.log(index);
          const el = data.data[index];
          const category = await this.categoriesProductModel.findOne({ name: el.test_type?.description });
          const product = await this.productModel.findOne({ name: el.name_complete });
          if (product) {
            await this.productModel.updateOne({ nameComplete: el.name_complete }, { $set: { category: category?._id, codFact: el?.cod_fact, discount: el?.discount, name: el?.name, nameComplete: el?.name_complete, price: el?.price, recommendations: el?.recommendations ? el?.recommendations[0]?.recommendation : '', synonym: el?.synonym, type: el?.type } });
          } else {
            await new this.productModel({ category: category?._id, codFact: el?.cod_fact, discount: el?.discount, name: el?.name, nameComplete: el?.name_complete, price: el?.price, recommendations: el?.recommendations ? el?.recommendations[0]?.recommendation : '', synonym: el?.synonym, type: el?.type }).save();
          }
        } catch (error) {
          this.logger.error(error.toString());
        }
      }
    }
  }
}
