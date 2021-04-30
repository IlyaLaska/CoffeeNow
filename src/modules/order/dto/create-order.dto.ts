import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, Length, ValidateNested } from 'class-validator';

import { OrderDish } from './order-dish.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  @Length(1, 4096)
  notes?: string;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => OrderDish)
  order!: OrderDish[];
}
