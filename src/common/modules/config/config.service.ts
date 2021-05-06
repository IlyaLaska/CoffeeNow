import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';

dotenv.config();

import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as Redis from 'ioredis';

import { AdminCredentials } from '../../types/AdminCredentials';
// import { S3Config } from '../../constants';
import { EnvVariables } from './env-variables.class';

@Injectable()
export class ConfigService {
  private readonly envVariables: EnvVariables;

  constructor() {
    this.envVariables = plainToClass(EnvVariables, process.env);
    const validationResult = validateSync(this.envVariables);
    if (validationResult.length) {
      // tslint:disable-next-line:no-console
      console.error('env validation error', validationResult);
      throw Error(`env validation error`);
    }
  }

  get PORT(): number {
    return this.envVariables.PORT;
  }

  get HOSTNAME(): string | undefined {
    return this.envVariables.HOSTNAME;
  }

  get FIREBASE_ADMIN_CREDENTIALS(): string {
    return this.envVariables.FIREBASE_ADMIN_CREDENTIALS;
  }

  get FIREBASE_API_KEY(): string {
    return this.envVariables.FIREBASE_API_KEY;
  }

  get adminCredentials(): AdminCredentials | null {
    if (!this.envVariables.ADMIN_EMAIL || !this.envVariables.ADMIN_PASSWORD) {
      return null;
    }
    return {
      email: this.envVariables.ADMIN_EMAIL,
      password: this.envVariables.ADMIN_PASSWORD,
    };
  }

  get initEnabled(): boolean {
    return !!this.envVariables.ADMIN_INIT_ENABLED;
  }

  get ormConfig(): TypeOrmModuleOptions {
    const ssl = this.envVariables.POSTGRES_CA_CERT
      ? {
          ca: process.env.POSTGRES_CA_CERT,
        }
      : false;
    return {
      type: 'postgres',
      host: this.envVariables.POSTGRES_HOST,
      port: this.envVariables.POSTGRES_PORT,
      username: this.envVariables.POSTGRES_USER,
      password: this.envVariables.POSTGRES_PASSWORD,
      database: this.envVariables.POSTGRES_DATABASE,
      autoLoadEntities: true,
      migrationsTableName: 'migration',
      cli: {
        migrationsDir: 'src/migration',
      },
      migrationsRun: true,
      ssl,
      synchronize: false,
      logging: false,
      cache: true,
      keepConnectionAlive: true,
    };
  }

  get redisConfig(): Redis.RedisOptions {
    const tls = this.envVariables.REDIS_TLS
      ? {
          host: this.envVariables.REDIS_HOST,
          port: this.envVariables.REDIS_PORT,
        }
      : undefined;
    return {
      host: this.envVariables.REDIS_HOST,
      port: this.envVariables.REDIS_PORT,
      username: this.envVariables.REDIS_USERNAME,
      password: this.envVariables.REDIS_PASSWORD,
      db: this.envVariables.REDIS_DB,
      keyPrefix: this.envVariables.REDIS_PREFIX,
      tls,
    };
  }
}
