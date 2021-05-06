import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { IdParamDto } from '../../common/dto/id-param.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  findAll(@Query() query: FindAllQueryDto): Promise<ListResultDto<Resource>> {
    return this.resourceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() idParamDto: IdParamDto): Promise<Resource> {
    return this.resourceService.findOne(idParamDto.id);
  }

  @Post()
  create(@Body() createResourceDto: CreateResourceDto): Promise<Resource> {
    return this.resourceService.create(createResourceDto);
  }

  @Put(':id')
  async update(@Param() idParamDto: IdParamDto, @Body() updateResourceDto: UpdateResourceDto): Promise<Resource> {
    await this.resourceService.update(idParamDto.id, updateResourceDto);
    return this.resourceService.findOne(idParamDto.id);
  }

  @Delete(':id')
  remove(@Param() idParamDto: IdParamDto): Promise<number | undefined | null> {
    return this.resourceService.remove(idParamDto.id);
  }
}
