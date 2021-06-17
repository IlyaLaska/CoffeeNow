import { IsDefined, IsInt, IsPositive } from 'class-validator';

export class OrderDish implements Readonly<OrderDish> {
  @IsDefined()
  @IsInt()
  @IsPositive()
  dishId!: number;

  @IsDefined()
  @IsInt()
  @IsPositive()
  amount!: number;
}
