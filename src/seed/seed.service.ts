import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { sampleUsers } from './data/sample-users';
import { ProductService } from '../product/product.service';
import { sampleProducts } from './data/sample-products';
import { CenterService } from '../center/center.service';
import { sampleCenters } from './data/sample-centers';
import { StockService } from '../stock/stock.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly authService: AuthService,
    private readonly productService: ProductService,
    private readonly centerService: CenterService,
    private readonly stockService: StockService,
  ) {}

  async seedUsers() {
    await this.authService.clear();
    await this.authService.populate(sampleUsers);
  }

  async seedProducts() {
    await this.productService.clear();
    await this.productService.populate(sampleProducts, 100);
  }

  async seedCenters() {
    await this.centerService.clear();
    await this.centerService.populate(sampleCenters);
  }

  async seedStockage() {
    // Get all the centers
    const centers = await this.centerService.findAll();
    for (const center of centers) {
      const stocks = await this.stockService.findAllByCenterName(center.name);
      for (const stock of stocks) {
        const { id } = stock;
        const maximum_storage = Math.floor(Math.random() * 10 + 1);
        const current_storage = Math.floor(
          Math.random() * (maximum_storage + 1),
        );
        await this.stockService.update(id, {
          maximum_storage,
          current_storage,
        });
      }
    }
  }

  async seedAll() {
    await this.stockService.clear();
    await this.productService.clear();
    await this.centerService.clear();
    await this.seedUsers();
    await this.seedCenters();
    await this.seedProducts();
    await this.seedStockage();
  }
}
