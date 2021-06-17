import { IsArray, IsDefined, IsInt, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateMenuDto {
  @IsDefined()
  @IsString()
  @Length(1, 128)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(1, 4096)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  dishIds?: number[];
}
