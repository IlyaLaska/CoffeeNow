import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsPositive } from 'class-validator';

export class IdParamDto implements Readonly<IdParamDto> {
  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id!: number;
}
