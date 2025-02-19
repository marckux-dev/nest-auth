import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  calculateSearchVector,
} from '../../common/helpers/string.helpers';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  short_name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: false,
    default: 'SIN CATEGORIA',
  })
  category: string;

  @Column({
    type: 'bool',
    nullable: false,
    default: true,
  })
  is_active: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: false,
  })
  active_principle: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: false,
  })
  synonyms: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  search_vector: string;

  @BeforeInsert()
  @BeforeUpdate()
  trimFields() {
    this.name = this.name.trim();
    this.short_name = this.short_name.trim();
    if (this.category)
      this.category = this.category.trim().toUpperCase();
    if (this.active_principle)
      this.active_principle = this.active_principle.trim();
  }

  @BeforeInsert()
  @BeforeUpdate()
  setSearchVector() {
    this.search_vector = calculateSearchVector([
      this.name,
      this.short_name,
      this.active_principle,
      this.synonyms,
    ]);
  }
}
