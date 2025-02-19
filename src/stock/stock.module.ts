import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { CenterModule } from '../center/center.module';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [StockController],
  providers: [StockService],
  imports: [TypeOrmModule.forFeature([Stock]), CenterModule, ProductModule, AuthModule],
  exports: [TypeOrmModule, StockService],
})
export class StockModule {}
