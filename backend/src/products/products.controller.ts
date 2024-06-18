import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { IhttpResponse } from 'src/common/interface/httpResponse/httpResponse.interface';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';
@ApiTags('products')
@Controller('products')
@UseGuards(ApiKeyGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post()
  // create(@Body() createProductDto: CreateProductDto) {
  //   return this.productsService.create(createProductDto);
  // }

  @Get('/:skip/:limit/:searchWord')
  async findAll(@Param('skip', ParseIntPipe) skip: number, @Param('limit', ParseIntPipe) limit: number,@Param('searchWord') searchWord: string): Promise<IhttpResponse> {
    try {
      return {
        message: '',
        success: true,
        data: { products: await this.productsService.findAll({ limit, skip, searchWord }), count: await this.productsService.findAllCount(searchWord) },
        statusCode: 200,
      };
    } catch (error) {
      return {
        message: 'Error al leer los productos',
        success: false,
        statusCode: 500,
        error: error.toString(),
      };
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
