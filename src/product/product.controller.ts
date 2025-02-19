import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { Role } from '../auth/interfaces';
import { Auth } from '../auth/decorators';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth(Role.ADMIN, Role.SUPER)
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Auth()
  @Get('categories')
  findCategories(): Promise<string[]> {
    return this.productService.getCategories();
  }

  @Auth()
  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Auth()
  @Get('by-category')
  findByCategory(): Promise<{ [key: string]: Product[] }> {
    return this.productService.findAllByCategory();
  }

  @Get('discontinued')
  findDiscontinued(): Promise<Product[]> {
    return this.productService.findDiscontinued();
  }

  @Auth()
  @Get('discontinued/by-category')
  findDiscontinuedByCategory(): Promise<{ [key: string]: Product[] }> {
    return this.productService.findDiscontinuedByCategory();
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Auth(Role.ADMIN, Role.SUPER)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.remove(id);
  }

  @Auth(Role.ADMIN, Role.SUPER)
  @Patch(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    return this.productService.restore(id);
  }
}
