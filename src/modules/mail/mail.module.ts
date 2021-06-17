import { Module } from '@nestjs/common';

import { ConfigModule } from '../../common/modules/config/config.module';
import { MailService } from './mail.service';

@Module({
  imports: [ConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
