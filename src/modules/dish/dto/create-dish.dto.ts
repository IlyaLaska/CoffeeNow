import { IsDefined, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateDishDto {
  @IsDefined()
  @IsString()
  @Length(1, 128)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(1, 4096)
  description?: string;

  @IsDefined()
  @IsNumber()
  @Min(0.01)
  price!: number;

  @IsDefined()
  @IsString()
  @Length(1, 128)
  category!: string;
}
