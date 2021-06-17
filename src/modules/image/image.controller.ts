import { BadRequestException, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Roles } from '../../common/decorators/roles.decorator';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { UuidParamDto } from '../../common/dto/uuid-param.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @Roles(RoleEnum.admin)
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
  @Roles(RoleEnum.admin)
  findAll(@Query() query: FindAllQueryDto): Promise<ListResultDto<Image>> {
    return this.imageService.findAll(query);
  }

  @Get(':id')
  @Roles(RoleEnum.admin)
  findOne(@Param() uuidParamDto: UuidParamDto): Promise<Image> {
    return this.imageService.findOneOnly(uuidParamDto.id);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  remove(@Param() uuidParamDto: UuidParamDto): Promise<number | undefined | null> {
    return this.imageService.softDelete(uuidParamDto.id);
  }
}
