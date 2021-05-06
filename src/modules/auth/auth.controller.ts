import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { LoginDto } from '../../common/dto/login.dto';
import { AuthService } from './auth.service';
import { AccessTokenStringDto } from './dto/accessTokenString.dto';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  adminSignIn(@Body() loginDto: LoginDto): Promise<AccessTokenStringDto> {
    return this.authService.getToken(loginDto);
  }
}
