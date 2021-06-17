import { IsArray, IsDefined, IsEmail, IsInt, IsPositive, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @Length(1, 256)
  name!: string;

  @IsDefined()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsString()
  @Length(1, 256)
  password!: string;

  @IsDefined()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  roleIds!: number[];
}
