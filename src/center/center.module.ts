import { Module } from '@nestjs/common';
import { CenterService } from './center.service';
import { CenterController } from './center.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Center } from './entities/center.entity';
import { Stock } from '../stock/entities/stock.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CenterController],
  providers: [CenterService],
  imports: [TypeOrmModule.forFeature([Center, Stock]), AuthModule],
  exports: [TypeOrmModule, CenterService],
})
export class CenterModule {}
