import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { ORDER_CODE_LEN } from '../../common/constants';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { DishService } from '../dish/dish.service';
import { OrderToDishService } from '../order-to-dish/order-to-dish.service';
import { RandomService } from '../random/random.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderStatusEnum } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly randomService: RandomService,
    private readonly dishService: DishService,
    private readonly orderToDishService: OrderToDishService,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // for (let i = 0; i < 10; i++) {
    //   const code = await this.randomService.generateRandomString(ORDER_CODE_LEN);
    //   if (await this.findByCode(code)) {
    //   }
    // }
    // throw new BadRequestException('Could not create an order. Please contact the administrator');
    let code = await this.randomService.generateRandomString(ORDER_CODE_LEN);
    while (await this.findByCode(code)) {
      console.log('Found active with same code');
      code = await this.randomService.generateRandomString(ORDER_CODE_LEN);
    }
    const dishIds = createOrderDto.order.map((orderDish) => orderDish.dishId);
    const dishes = await this.dishService.findMany(dishIds);

    const price = dishes.reduce((acc: number, dish) => {
      const orderDish = createOrderDto.order.find((oD) => oD.dishId === dish.id);
      if (!orderDish) {
        throw new BadRequestException('Could not find dish');
      }
      return acc + dish.price * orderDish.amount;
    }, 0);

    const order = await this.orderRepository.save({
      code: code,
      notes: createOrderDto.notes,
      status: OrderStatusEnum.processing,
      price: price,
    });
    await this.orderToDishService.addOrder(order.id, createOrderDto.order);
    return await this.findOne(order.id);
  }

  async findAll(query: FindAllQueryDto): Promise<ListResultDto<Order>> {
    const [result, totalCount] = await this.orderRepository.findAndCount({
      where: { status: Not(OrderStatusEnum.completed) },
      ...query.toSQL(),
    });
    return { result, totalCount };
  }

  async findAllWithCompleted(query: FindAllQueryDto): Promise<ListResultDto<Order>> {
    const [result, totalCount] = await this.orderRepository.findAndCount({ ...query.toSQL() });
    return { result, totalCount };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findByCode(code: string): Promise<Order | undefined> {
    return await this.orderRepository.findOne({ where: { code: code, status: Not(OrderStatusEnum.completed) } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderRepository.save<Partial<Order>>({
      id,
      ...updateOrderDto,
    });
  }

  async remove(id: number): Promise<number | undefined | null> {
    const res = await this.orderRepository.delete(id);
    return res.affected;
  }
}
