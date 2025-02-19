import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, MoveStockDto, UpdateStockDto } from './dto';
import { Stock } from './entities/stock.entity';
import { Auth } from '../auth/decorators';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Auth()
  @Post()
  create(@Body() createStockDto: CreateStockDto): Promise<Stock> {
    return this.stockService.create(createStockDto);
  }

  @Auth()
  @Get()
  findAll(): Promise<Stock[]> {
    return this.stockService.findAll();
  }

  @Auth()
  @Get('center/:name')
  findAllByCenterName(@Param('name') name: string) {
    return this.stockService.findAllByCenterName(name);
  }

  @Auth()
  @Get('center/:name/by-category')
  findAllByCenterNameCategorized(@Param('name') name: string) {
    return this.stockService.findCategorizedByCenterName(name);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Stock> {
    return this.stockService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(id, updateStockDto);
  }

  @Auth()
  @Patch(':id/move')
  move(@Param('id', ParseUUIDPipe) id: string, @Body() moveStockDto: MoveStockDto) {
    return this.stockService.move(id, moveStockDto);
  }

}
