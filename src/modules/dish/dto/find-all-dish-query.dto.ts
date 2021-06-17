import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindAllDishQueryDto implements Readonly<FindAllDishQueryDto> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(-1)
  @Max(10000)
  take = 25;

  @IsOptional()
  @IsString()
  @IsIn(['createDate', 'updateDate', 'id', 'name', 'description', 'price', 'category'])
  sortBy = 'name';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order = 'asc';

  get orderAsc(): 'ASC' | 'DESC' {
    return this.order.toUpperCase() as 'ASC' | 'DESC';
  }

  get takeLimit(): number | undefined {
    return this.take < 0 ? undefined : this.take;
  }

  public toSQL(): {
    skip: number;
    take: number | undefined;
    order: Record<string, 'ASC' | 'DESC' | undefined>;
  } {
    return {
      skip: this.skip,
      take: this.takeLimit,
      order: {
        [this.sortBy]: this.orderAsc,
      },
    };
  }
}
