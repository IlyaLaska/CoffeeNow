import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { FindAllNamedQueryDto } from '../../common/dto/find-all-named-query.dto';
import { IdParamDto } from '../../common/dto/id-param.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(RoleEnum.admin)
  create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: FindAllNamedQueryDto): Promise<ListResultDto<Menu>> {
    return this.menuService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param() idParamDto: IdParamDto): Promise<Menu> {
    return this.menuService.findOne(idParamDto.id);
  }

  @Put(':id')
  @Roles(RoleEnum.admin)
  update(@Param() idParamDto: IdParamDto, @Body() updateMenuDto: UpdateMenuDto): Promise<Menu> {
    return this.menuService.update(idParamDto.id, updateMenuDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  remove(@Param() idParamDto: IdParamDto): Promise<number | undefined | null> {
    return this.menuService.remove(idParamDto.id);
  }
}
