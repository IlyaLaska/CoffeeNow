import { IsDefined, IsString, Length } from 'class-validator';

export class CodeParamDto implements Readonly<CodeParamDto> {
  @IsDefined()
  @IsString()
  @Length(8, 8)
  code!: string;
}
