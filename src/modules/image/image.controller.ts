import { BadRequestException, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Public } from '../../common/decorators/public.decorator';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { UuidParamDto } from '../../common/dto/uuid-param.dto';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Public()
  @Post()
  async upload(@Req() req: FastifyRequest): Promise<Image> {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }
    const data = await req.file();
    if (!data.mimetype?.match('image/*')) {
      throw new BadRequestException('Only image allowed');
    }
    return this.imageService.uploadAndSave(data.filename, data.file, data.mimetype);
  }

  @Get()
  findAll(@Query() query: FindAllQueryDto): Promise<ListResultDto<Image>> {
    return this.imageService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() uuidParamDto: UuidParamDto): Promise<Image> {
    return this.imageService.findOneOnly(uuidParamDto.id);
  }

  @Delete(':id')
  remove(@Param() uuidParamDto: UuidParamDto): Promise<number | undefined | null> {
    return this.imageService.softDelete(uuidParamDto.id);
  }
}
