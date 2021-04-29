import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { FindAllNamedQueryDto } from '../../common/dto/find-all-named-query.dto';
import { IdParamDto } from '../../common/dto/id-param.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  create(@Body() createDishDto: CreateDishDto): Promise<Dish> {
    return this.dishService.create(createDishDto);
  }

  @Get()
  findAll(@Query() query: FindAllNamedQueryDto): Promise<ListResultDto<Dish>> {
    return this.dishService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() idParamDto: IdParamDto): Promise<Dish> {
    return this.dishService.findOne(idParamDto.id);
  }

  @Put(':id')
  update(@Param() idParamDto: IdParamDto, @Body() updateDishDto: UpdateDishDto): Promise<Dish> {
    return this.dishService.update(idParamDto.id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param() idParamDto: IdParamDto): Promise<number | undefined | null> {
    return this.dishService.remove(idParamDto.id);
  }
}
