import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { ProductModule } from '../product/product.module';
import { CenterModule } from '../center/center.module';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [AuthModule, ProductModule, CenterModule, StockModule],
  providers: [SeedService],
  exports: [],
  controllers: [SeedController],
})
export class SeedModule {}
