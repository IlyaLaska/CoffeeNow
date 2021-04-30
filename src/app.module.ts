import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/modules/config/config.module';
import { ConfigService } from './common/modules/config/config.service';
import { DishModule } from './modules/dish/dish.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { OrderToDishModule } from './modules/order-to-dish/order-to-dish.module';
import { RandomModule } from './modules/random/random.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.ormConfig,
      }),
    }),
    ConfigModule,
    MenuModule,
    DishModule,
    OrderModule,
    OrderToDishModule,
    RandomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
