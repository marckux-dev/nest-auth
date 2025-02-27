import {
  // BeforeInsert,
  // BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../interfaces';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column({
  //   type: 'varchar',
  //   length: 255,
  //   nullable: false,
  //   unique: true,
  // })
  // email: string;

  @Column({
    type    : 'varchar',
    length  : 255,
    nullable: false,
    select  : false,
  })
  password  : string;

  @Column({
    type    : 'varchar',
    length  : 255,
    nullable: false,
    unique  : true
  })
  full_name : string;

  @Column({
    type    : 'bool',
    nullable: false,
    default : true,
  })
  is_active : boolean;

  @Column({
    type    : 'varchar',
    length  : 255,
    array   : true,
    nullable: false,
    default : [Role.USER],
  })
  roles     : string[];

  containsRole(role: Role): boolean {
    return this.roles.includes(role);
  }
}
