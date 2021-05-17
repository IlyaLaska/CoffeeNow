import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DishModule } from '../dish/dish.module';
import { MailModule } from '../mail/mail.module';
import { OrderToDishModule } from '../order-to-dish/order-to-dish.module';
import { RandomModule } from '../random/random.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), RandomModule, DishModule, OrderToDishModule, MailModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
