import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  imports: [AuthModule],
  providers: [SeedService],
  exports: [],
  controllers: [SeedController],
})
export class SeedModule {}
