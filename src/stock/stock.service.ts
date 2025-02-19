import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { CenterService } from '../center/center.service';
import { ProductService } from '../product/product.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Product } from '../product/entities/product.entity';
import { Center } from '../center/entities/center.entity';
import { CreateStockDto, MoveStockDto, UpdateStockDto } from './dto';

@Injectable()
export class StockService {
  private readonly logger: Logger = new Logger(StockService.name);
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly centerService  : CenterService,
    private readonly productService : ProductService,
    private readonly eventEmitter    : EventEmitter2,
  ) {}

  async create(createStockDto: CreateStockDto) {
    const { centerId, productId, maximum_storage, current_storage, stock_category } = createStockDto;
    const center: Center = await this.centerService.findOne(centerId)
    const product: Product = await this.productService.findOne(productId);

    const stock: Stock = this.stockRepository.create({
      center,
      product,
      maximum_storage,
      current_storage,
      stock_category: stock_category || product.category
    });

    stock.stock_order = await this.stockRepository.count({
      where: {
        center: { id: center.id },
        stock_category: stock.stock_category
      }
    });

    try {
      return await this.stockRepository.save(stock);
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(): Promise<Stock[]> {
    return this.stockRepository.find();
  }

  findAllByCenterName(name: string): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { center: { name: ILike(`%${name}%`) } },
      order: { stock_order: 'ASC' },
    });
  }

  async findCategorizedByCenterName(name: string): Promise< {[k:string]: Stock[]} > {
    const stocks = await this.findAllByCenterName(name);
    return this.categorizeStocks(stocks);
  }

  async findOne(id: string): Promise<Stock> {
    const stock: Stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['product', 'center'],
    });
    if (!stock) throw new NotFoundException('Stock not found');
    return stock;
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    // find the stock
    const stock: Stock = await this.findOne(id);
    // update the stock
    const updatedStock = { ...stock, ...updateStockDto };
    try {
      return await this.stockRepository.save(updatedStock);
    } catch (error) {
      this.handleError(error);
    }
  }

  async move(id: string, moveStockDto: MoveStockDto): Promise<Stock> {
    // find the stock
    let stock: Stock = await this.findOne(id);
    const { stock_category: newStockCategory, stock_order: newStockOrder } = moveStockDto;
    if (newStockCategory && newStockCategory !== stock.stock_category) {
      stock = await this.changeCategory(stock, newStockCategory);
    }
    if (newStockOrder === undefined) return stock;
    const stocks = (await this.stockRepository.find({
      where: { center: stock.center, stock_category: stock.stock_category },
      order: { stock_order: 'ASC' }
    })).filter(s => s.id !== stock.id);
    const index = Math.min(stocks.length, newStockOrder);
    stocks.splice(index,0,stock)
    this.reorderStocks(stocks)
    await Promise.all(
      stocks.map(s => this.stockRepository.save(s))
    );
    return stocks[index];
  }

  private async changeCategory(stock: Stock, category: string): Promise<Stock> {

    const originalStocks = (await this.stockRepository.find({
      where: { center: stock.center, stock_category: stock.stock_category },
      order: { stock_order: 'ASC' }
    })).filter(s => s.id !== stock.id);
    this.reorderStocks(originalStocks);
    await Promise.all(
      originalStocks.map(
        s => this.stockRepository.save(s)
      )
    );

    stock.stock_category = category;
    stock.stock_order = await this.stockRepository.count({
      where: { center: stock.center, stock_category: category }
    });
    return await this.stockRepository.save(stock);
  }

  private reorderStocks(stocks: Stock[]): void {
    for (let i = 0; i < stocks.length; i++) {
      stocks[i].stock_order = i;
    }
  }

  clear(): Promise<DeleteResult> {
    return this.stockRepository.delete({});
  }

  @OnEvent('product.created')
  async handleNewProduct(product: Product): Promise<Stock[]> {
    const centers: Center[] = await this.centerService.findAll();
    const stockEntries: CreateStockDto[] = centers.map(
      (center: Center): CreateStockDto => ({
        centerId: center.id,
        productId: product.id,
        maximum_storage: 0,
        current_storage: 0,
    }));
    const stocks: Stock[] = [];
    //
    for (const stockEntry of stockEntries) {
      stocks.push(await this.create(stockEntry));
    }
    return stocks;
  }

  @OnEvent('center.created')
  async handleNewCenter(center: Center): Promise<Stock[]> {
    const products: Product[] = await this.productService.findAll();
    const stockEntries: CreateStockDto[] = products.map(
      (product: Product): CreateStockDto => ({
        centerId: center.id,
        productId: product.id,
        maximum_storage: 0,
        current_storage: 0,
    }));
    const stocks: Stock[] = [];
    for (const stockEntry of stockEntries) {
      stocks.push(await this.create(stockEntry));
    }
    return stocks;
  }

  @OnEvent('product.removed')
  async handleRemovedProduct(product: Product): Promise<Stock[]> {
    const stocks: Stock[] = await this.stockRepository.find({
      where: { product: { id: product.id } },
    });
    const updatedStocks: Stock[] = [];
    for (const stock of stocks) {
      updatedStocks.push(await this.update(stock.id, { maximum_storage: 0 }));
    }
    return updatedStocks;
  }

  private handleError(error: any): void {
    if (error.code === '23505') {
      throw new BadRequestException('Stock already exists');
    }
    this.logger.log(error);
    throw new NotFoundException('Something went wrong. See logs.');
  }

  private categorizeStocks( stocks: Stock[] ): { [key: string]: Stock[] } {
    return stocks.reduce(
      (acc, stock) => {
        if (!acc[stock.stock_category]) acc[stock.stock_category] = [];
        acc[stock.stock_category].push(stock);
        return acc;
        },
      {} as { [key: string]: Stock[] }
    );
  }



}
