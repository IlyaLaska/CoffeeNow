import { IsDefined, IsString, IsUUID } from 'class-validator';

export class UuidParamDto implements Readonly<UuidParamDto> {
  @IsDefined()
  @IsString()
  @IsUUID()
  id!: string;
}
