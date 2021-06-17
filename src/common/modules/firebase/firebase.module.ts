import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService],
  controllers: [],
  exports: [FirebaseService],
})
export class FirebaseModule {}
