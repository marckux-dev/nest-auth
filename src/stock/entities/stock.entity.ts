import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Center } from '../../center/entities/center.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('centers_products')
@Unique(['center', 'product'])
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Center,
    (center) => center.stockage,
    { eager: true }
  )
  center: Center;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('int', { default: 0 })
  maximum_storage: number;

  @Column('int', { default: 0 })
  current_storage: number;

  @Column('int', { default: 0 })
  stock_order: number;

  @Column({type: 'varchar', length: 255, nullable: false})
  stock_category: string;

  @BeforeInsert()
  assignDefaultStockCategory() {
    if (!this.stock_category && this.product) {
      this.stock_category = this.product.category;
    }
  }
}
