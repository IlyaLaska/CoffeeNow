import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseGuard } from './common/guards/firebase-guard.service';
import { ConfigModule } from './common/modules/config/config.module';
import { ConfigService } from './common/modules/config/config.service';
import { FirebaseModule } from './common/modules/firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { DishModule } from './modules/dish/dish.module';
import { ImageModule } from './modules/image/image.module';
import { InitModule } from './modules/init/init.module';
import { MailModule } from './modules/mail/mail.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrderModule } from './modules/order/order.module';
import { OrderToDishModule } from './modules/order-to-dish/order-to-dish.module';
import { RandomModule } from './modules/random/random.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';

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
    AuthModule,
    InitModule,
    RoleModule,
    UserModule,
    FirebaseModule,
    MailModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: FirebaseGuard,
    },
  ],
})
export class AppModule {}
