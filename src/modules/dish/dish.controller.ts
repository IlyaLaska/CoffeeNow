import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { IdParamDto } from '../../common/dto/id-param.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { FindAllDishQueryDto } from './dto/find-all-dish-query.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @Roles(RoleEnum.admin)
  create(@Body() createDishDto: CreateDishDto): Promise<Dish> {
    return this.dishService.create(createDishDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: FindAllDishQueryDto): Promise<ListResultDto<Dish>> {
    return this.dishService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param() idParamDto: IdParamDto): Promise<Dish> {
    return this.dishService.findOne(idParamDto.id);
  }

  @Put(':id')
  @Roles(RoleEnum.admin)
  update(@Param() idParamDto: IdParamDto, @Body() updateDishDto: UpdateDishDto): Promise<Dish> {
    return this.dishService.update(idParamDto.id, updateDishDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  remove(@Param() idParamDto: IdParamDto): Promise<number | undefined | null> {
    return this.dishService.remove(idParamDto.id);
  }
}
