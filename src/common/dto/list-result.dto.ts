import { IsArray, IsDefined, IsNumber, IsPositive } from 'class-validator';

export class ListResultDto<Entity> {
  @IsDefined()
  @IsArray()
  result!: Entity[];

  @IsDefined()
  @IsNumber()
  @IsPositive()
  totalCount!: number;
}
