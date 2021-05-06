import { Module } from '@nestjs/common';

import { ConfigModule } from '../../common/modules/config/config.module';
import { ResourceModule } from '../resource/resource.module';
import { UserModule } from '../user/user.module';
import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
  imports: [ResourceModule, UserModule, ConfigModule],
  providers: [InitService],
  controllers: [InitController],
})
export class InitModule {}
