import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Dish } from '../../dish/entities/dish.entity';
import { Order } from '../../order/entities/order.entity';

@Entity()
export class OrderToDish {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderId!: number;

  @Column()
  dishId!: number;

  @Column({ default: 1 })
  amount!: number;

  @ManyToOne(() => Order, (order) => order.orderToDish, { onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => Dish, (dish) => dish.orderToDish, { onDelete: 'CASCADE' })
  dish!: Dish;
}
