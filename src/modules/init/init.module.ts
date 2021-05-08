import { Module } from '@nestjs/common';

import { ConfigModule } from '../../common/modules/config/config.module';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';
import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
  imports: [RoleModule, UserModule, ConfigModule],
  providers: [InitService],
  controllers: [InitController],
})
export class InitModule {}
