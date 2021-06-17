import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Roles } from '../../common/decorators/roles.decorator';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { IdParamDto } from '../../common/dto/id-param.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RoleEnum } from './enums/role.enum';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Roles(RoleEnum.admin)
  findAll(@Query() query: FindAllQueryDto): Promise<ListResultDto<Role>> {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  @Roles(RoleEnum.admin)
  findOne(@Param() idParamDto: IdParamDto): Promise<Role> {
    return this.roleService.findOne(idParamDto.id);
  }

  @Post()
  @Roles(RoleEnum.admin)
  create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.create(createRoleDto);
  }

  @Put(':id')
  @Roles(RoleEnum.admin)
  async update(@Param() idParamDto: IdParamDto, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.roleService.update(idParamDto.id, updateRoleDto);
    return this.roleService.findOne(idParamDto.id);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  remove(@Param() idParamDto: IdParamDto): Promise<number | undefined | null> {
    return this.roleService.remove(idParamDto.id);
  }
}
