import { IsDefined, IsEnum } from 'class-validator';

import { OrderStatusEnum } from '../enums/order-status.enum';

export class UpdateOrderDto {
  @IsDefined()
  @IsEnum(OrderStatusEnum)
  status!: OrderStatusEnum;
}
