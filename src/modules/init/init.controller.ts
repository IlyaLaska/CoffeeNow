import { Controller, Get } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { InitService } from './init.service';

@Controller('init')
@Public()
export class InitController {
  constructor(private readonly initService: InitService) {}
  @Get()
  async adminInit(): Promise<string> {
    return await this.initService.adminInit();
  }
}
