import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderToDish } from './entities/order-to-dish.entity';
import { OrderToDishService } from './order-to-dish.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderToDish])],
  providers: [OrderToDishService],
  exports: [OrderToDishService],
})
export class OrderToDishModule {}
