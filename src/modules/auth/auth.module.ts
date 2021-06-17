import { Module } from '@nestjs/common';

import { FirebaseModule } from '../../common/modules/firebase/firebase.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [FirebaseModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
