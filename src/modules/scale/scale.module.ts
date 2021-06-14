import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Scale } from './entities/scale.entity';
import { ScaleService } from './scale.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scale])],
  providers: [ScaleService],
  exports: [ScaleService],
})
export class ScaleModule {}
