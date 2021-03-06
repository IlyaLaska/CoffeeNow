import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class EnvVariables implements Readonly<EnvVariables> {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsIn(['production', 'development', 'test', 'stage'])
  NODE_ENV!: string;

  @IsDefined()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT!: number;

  @IsOptional()
  @IsString()
  HOST?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST!: string;

  @IsDefined()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(65535)
  POSTGRES_PORT = 5432;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  POSTGRES_USER!: string;

  @IsDefined()
  @IsString()
  POSTGRES_PASSWORD!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  POSTGRES_DATABASE!: string;

  @IsOptional()
  @IsString()
  POSTGRES_CA_CERT?: string;

  @IsDefined()
  @IsNotEmpty()
  FIREBASE_ADMIN_CREDENTIALS!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  FIREBASE_API_KEY!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  ADMIN_EMAIL?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  ADMIN_PASSWORD?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform((val) => ['1', 1, 'true', true].includes(val.value))
  @IsBoolean()
  ADMIN_INIT_ENABLED?: boolean;

  @IsOptional()
  @IsString()
  REDIS_USERNAME?: string;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  REDIS_HOST!: string;

  @IsDefined()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(65535)
  REDIS_PORT = 6379;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(15)
  REDIS_DB = 0;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  REDIS_PREFIX?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  REDIS_TLS?: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  MAIL_PASS!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  MAIL_ADDRESS!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  S3_BUCKET!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  S3_IMAGES_FOLDER!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  S3_FILES_FOLDER!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  S3_USER_ENDPOINT!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  S3_SECRET_ACCESS_KEY!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  S3_ACCESS_KEY_ID!: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  S3_ENDPOINT!: string;
}
