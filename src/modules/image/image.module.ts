import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../../common/modules/config/config.module';
import { S3Module } from '../../common/modules/s3/s3.module';
import { ScaleModule } from '../scale/scale.module';
import { Image } from './entities/image.entity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), ConfigModule, S3Module, ScaleModule],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
