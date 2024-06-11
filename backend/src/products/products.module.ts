import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, Product } from './schemas/products.schema';
import { CategoriesProductSchema, CategoriesProduct } from './schemas/categoriesProduct.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), MongooseModule.forFeature([{ name: CategoriesProduct.name, schema: CategoriesProductSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule { }
