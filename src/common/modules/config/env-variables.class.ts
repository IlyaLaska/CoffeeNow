import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from 'class-validator';

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
  HOSTNAME?: string;

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
}
