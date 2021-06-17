import { IsDefined, IsEnum, IsString, Length } from 'class-validator';

import { RoleEnum } from '../enums/role.enum';

export class CreateRoleDto {
  @IsDefined()
  @IsString()
  @Length(1, 256)
  name!: string;

  @IsDefined()
  @IsEnum(RoleEnum)
  key!: string;
}
