import { IsDefined, IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsDefined()
  @IsEmail()
  email!: string;

  @IsDefined()
  @IsString()
  @Length(1, 256)
  password!: string;
}
