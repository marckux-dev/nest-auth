import { Controller, Post } from '@nestjs/common';
// import { Auth } from '../auth/decorators';
// import { Role } from '../auth/interfaces';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('users')
  seedUsers() {
    return this.seedService.seedUsers();
  }

  @Post('products')
  seedProducts() {
    return this.seedService.seedProducts();
  }

  @Post('centers')
  seedCenters() {
    return this.seedService.seedCenters();
  }

  @Post('stockage')
  seedStockage(): Promise<void> {
    return this.seedService.seedStockage();
  }

  @Post('all')
  seedAll() {
    return this.seedService.seedAll();
  }
}
