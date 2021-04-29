import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { ConfigService } from './common/modules/config/config.service';

async function pipes(app: INestApplication): Promise<void> {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

async function interceptors(app: INestApplication): Promise<void> {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

async function listen(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);
  if (configService.HOSTNAME) {
    await app.listen(configService.PORT, configService.HOSTNAME);
  } else {
    await app.listen(configService.PORT);
  }
}

async function bootstrap(): Promise<void> {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  await pipes(app);
  await interceptors(app);
  await listen(app);
}

bootstrap();
