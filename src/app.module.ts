import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/modules/config/config.module';
import { MenuModule } from './modules/menu/menu.module';
import { DishModule } from './modules/dish/dish.module';

@Module({
  imports: [ConfigModule, MenuModule, DishModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
