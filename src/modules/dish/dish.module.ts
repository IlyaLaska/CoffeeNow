import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageModule } from '../image/image.module';
import { DishController } from './dish.controller';
import { DishService } from './dish.service';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish]), ImageModule],
  controllers: [DishController],
  providers: [DishService],
  exports: [DishService],
})
export class DishModule {}
