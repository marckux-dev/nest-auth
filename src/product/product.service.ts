import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto';
import { delay } from '../common/helpers/asynchronous.helpers';
import { compareNormalizedString } from '../common/helpers/string.helpers';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product: Product = this.productRepository.create(createProductDto);
    try {
      const newProduct: Product =
        await this.productRepository.save<Product>(product);
      // Yield when a new product is created. Stocks will listen this event.
      this.eventEmitter.emit('product.created', newProduct);
      return newProduct;
    } catch (error) {
      this.handleError(error);
    }
  }
  async findAll(): Promise<Product[]> {
    const products: Product[] = await this.productRepository.find({
      where: { is_active: true },
    });
    return products.sort((p1, p2) =>
      compareNormalizedString(p1.name, p2.name));
  }

  async findAllByCategory(): Promise< {[key: string]: Product[]} > {
    const products: Product[] = await this.findAll();
    return this.categorizeProducts(products);
  }

  findDiscontinued(): Promise<Product[]> {
    return this.productRepository.find({
      where: { is_active: false },
    });
  }

  async findDiscontinuedByCategory(): Promise< {[key: string]: Product[]} > {
    const products = await this.findDiscontinued();
    return this.categorizeProducts(products);
  }

  async findOne(id: string): Promise<Product> {
    const product: Product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getCategories(): Promise<string[]> {
    const categories: {category: string}[] = await this.productRepository
      .createQueryBuilder()
      .select('DISTINCT category')
      .orderBy('category', 'ASC')
      .getRawMany();
    return categories.map((c: {category: string}): string => c.category);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product: Product = await this.findOne(id);
    try {
      return await this.productRepository.save({
        ...product,
        ...updateProductDto,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string): Promise<Product> {
    const product: Product = await this.findOne(id);
    const timeInMillis: number = Date.now();
    if (!product.is_active)
      throw new BadRequestException('The product is already deleted');
    const name = `${product.name} d:${timeInMillis}`;
    const short_name = `${product.short_name} d:${timeInMillis}`;
    const updatedProduct: Product = await this.update(id, {
      name,
      short_name,
      is_active: false,
    });
    this.eventEmitter.emit('product.removed', updatedProduct);
    return updatedProduct;
  }

  clear(): Promise<DeleteResult> {
    return this.productRepository.delete({});
  }

  async populate(products: CreateProductDto[], delayTime: number = 0): Promise<void> {
    try {
      for (const product of products) {
        await this.create(product);
        if (delayTime > 0)
          await delay(delayTime)
      }
    } catch (error: any) {
      this.logger.log(error);
      throw new InternalServerErrorException('Something went wrong when trying to populate products. See logs for more information.');
    }
  }

  async restore(id: string) {
    const product: Product = await this.findOne(id);
    if (product.is_active)
      throw new BadRequestException('The product is not deleted');
    const name: string = product.name.replace(/(.*)\sd:[0-9]+$/, '$1');
    const short_name: string = product.short_name.replace(/(.*)\sd:[0-9]+$/, '$1');
    return this.update(id, {
      name,
      short_name,
      is_active: true,
    });
  }

  private categorizeProducts( products: Product[] ): {[key:string]: Product[]}  {
    return products.reduce((acc, product)=>{
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {} as { [key: string]: Product[] });
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      // unique constraint violation
      this.handleDuplicationError(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Something went wrong. See logs');
  }

  private handleDuplicationError(detail: string) {
    const match = detail.match(/\(([^)]+)\).*\(([^)]+)\)/);
    if (match) {
      const field = match[1];
      const value = match[2];
      throw new BadRequestException({
        message: `El campo ${field} con el valor ${value} ya está en uso`,
        field,
        invalidValue: value,
      });
    }
  }
}
