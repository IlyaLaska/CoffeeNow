import { IsDefined, IsString } from 'class-validator';

export class AccessTokenStringDto implements Readonly<AccessTokenStringDto> {
  @IsDefined()
  @IsString()
  access_token!: string;
}
