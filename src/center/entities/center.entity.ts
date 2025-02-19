import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';

@Entity('centers')
export class Center {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => Stock, (stock) => stock.center, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  stockage: Stock[];
}
