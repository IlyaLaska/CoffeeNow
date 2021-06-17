import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderDish } from '../order/dto/order-dish.dto';
import { OrderToDish } from './entities/order-to-dish.entity';

@Injectable()
export class OrderToDishService {
  constructor(
    @InjectRepository(OrderToDish)
    private readonly orderToDishRepository: Repository<OrderToDish>,
  ) {}

  async addOrder(orderId: number, orderDishes: OrderDish[]): Promise<void> {
    const items = orderDishes.map((orderDish) => {
      return {
        orderId: orderId,
        dishId: orderDish.dishId,
        amount: orderDish.amount,
      };
    });
    await this.orderToDishRepository.save(items);
  }
}
