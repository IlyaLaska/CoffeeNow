import { Injectable } from '@nestjs/common';

import { LoginDto } from '../../common/dto/login.dto';
import { FirebaseService } from '../../common/modules/firebase/firebase.service';
import { AccessTokenStringDto } from './dto/accessTokenString.dto';

@Injectable()
export class AuthService {
  constructor(private firebaseService: FirebaseService) {}

  async getToken(loginDto: LoginDto): Promise<AccessTokenStringDto> {
    return { access_token: await this.firebaseService.getToken(loginDto) };
  }
}
