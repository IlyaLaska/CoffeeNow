import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsPositive, Min } from 'class-validator';

export class ImageScaleParamDto implements Readonly<ImageScaleParamDto> {
  @IsDefined()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(24)
  scale!: number;
}
