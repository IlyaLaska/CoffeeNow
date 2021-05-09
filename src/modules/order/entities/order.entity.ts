import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { OrderToDish } from '../../order-to-dish/entities/order-to-dish.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 16 })
  code!: string;

  @OneToMany(() => OrderToDish, (orderToDish) => orderToDish.order)
  orderToDish!: OrderToDish[];

  @Column({ length: 4096, nullable: true })
  notes?: string;

  @Column({ length: 32 })
  status!: string;

  @Column({ default: 0, type: 'numeric', precision: 8, scale: 2 })
  price!: number;

  @UpdateDateColumn()
  updateDate!: Date;

  @CreateDateColumn()
  createDate!: Date;

  @VersionColumn({ default: 1 })
  version!: number;
}
