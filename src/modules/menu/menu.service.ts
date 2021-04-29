import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { FindAllNamedQueryDto } from '../../common/dto/find-all-named-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { DishService } from '../dish/dish.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly dishService: DishService,
  ) {}
  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const dishes = createMenuDto.dishIds ? await this.dishService.findMany(createMenuDto.dishIds) : undefined;
    return this.menuRepository.save({ dishes, ...createMenuDto });
  }

  async findAll(query: FindAllNamedQueryDto): Promise<ListResultDto<Menu>> {
    const [result, totalCount] = await this.menuRepository.findAndCount({ ...query.toSQL() });
    return { result, totalCount };
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne(id);
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    return menu;
  }

  async findMany(ids: number[]): Promise<Menu[]> {
    const menus = await this.menuRepository.find({ where: { id: In(ids) } });
    if (!menus) {
      throw new NotFoundException(`No menus found`);
    }
    return menus;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    // TODO need partial?
    if (updateMenuDto.dishIds) {
      const dishes = await this.dishService.findMany(updateMenuDto.dishIds);
      return this.menuRepository.save<Partial<Menu>>({
        id,
        dishes: dishes,
        ...updateMenuDto,
      });
    } else {
      return this.menuRepository.save<Partial<Menu>>({
        id,
        ...updateMenuDto,
      });
    }
  }

  async remove(id: number): Promise<number | undefined | null> {
    const res = await this.menuRepository.delete(id);
    return res.affected;
  }
}
