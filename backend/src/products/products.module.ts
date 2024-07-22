import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, Product } from './schemas/products.schema';
import { CategoriesProductSchema, CategoriesProduct } from './schemas/categoriesProduct.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), MongooseModule.forFeature([{ name: CategoriesProduct.name, schema: CategoriesProductSchema }]), HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
