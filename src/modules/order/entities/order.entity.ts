import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  price!: number;
}
