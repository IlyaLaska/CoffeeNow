import { IsDefined, IsString, Length } from 'class-validator';

export class CreateResourceDto {
  @IsDefined()
  @IsString()
  @Length(1, 256)
  name!: string;

  @IsDefined()
  @IsString()
  @Length(1, 256)
  key!: string;
}
