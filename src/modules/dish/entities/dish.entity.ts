import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Image } from '../../image/entities/image.entity';
import { Menu } from '../../menu/entities/menu.entity';
import { OrderToDish } from '../../order-to-dish/entities/order-to-dish.entity';

@Entity()
export class Dish {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 128 })
  name!: string;

  @Column({ length: 4096, nullable: true })
  description?: string;

  @Column({ default: 0, type: 'numeric', precision: 8, scale: 2 })
  price!: number;

  @Column({ length: 128 })
  category!: string;

  @ManyToMany(() => Menu, (menu) => menu.dishes)
  menus?: Menu[];

  @OneToMany(() => OrderToDish, (orderToDish) => orderToDish.dish)
  orderToDish!: OrderToDish[];

  @OneToOne(() => Image, (image) => image.dish, { eager: true })
  @JoinColumn()
  image?: Image;

  @UpdateDateColumn()
  updateDate!: Date;

  @CreateDateColumn()
  createDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
