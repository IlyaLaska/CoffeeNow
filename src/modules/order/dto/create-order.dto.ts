import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, Length, ValidateNested } from 'class-validator';

import { OrderDish } from './order-dish.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @Length(0, 4096)
  notes?: string;

  @IsDefined()
  @IsString()
  email!: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OrderDish)
  order!: OrderDish[];
}
