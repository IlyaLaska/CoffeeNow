import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
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

async function cors(app: INestApplication): Promise<void> {
  const options: CorsOptions = {
    origin: true,
  };

  app.enableCors(options);
}

async function listen(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);
  if (configService.HOST) {
    console.log(`Listening at ${configService.HOST}:${configService.PORT}`);
    await app.listen(configService.PORT, configService.HOST);
  } else {
    await app.listen(configService.PORT);
  }
}

async function bootstrap(): Promise<void> {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  await pipes(app);
  await interceptors(app);
  await cors(app);
  await listen(app);
}

bootstrap();
