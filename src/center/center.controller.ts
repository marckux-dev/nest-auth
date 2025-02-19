import { Controller, Get, Param } from '@nestjs/common';
import { CenterService } from './center.service';
import { Center } from './entities/center.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Auth } from '../auth/decorators';

@Controller('centers')
export class CenterController {
  constructor(private readonly centerService: CenterService) {}

  @Auth()
  @Get()
  findAll(): Promise<Center[]> {
    return this.centerService.findAll();
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Center> {
    return this.centerService.findOne(id);
  }

  @Auth()
  @Get(':id/stockage')
  getStockage(@Param('id') id: string): Promise<Stock[]> {
    return this.centerService.getStockage(id);
  }
}
