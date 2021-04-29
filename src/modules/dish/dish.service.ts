import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { FindAllNamedQueryDto } from '../../common/dto/find-all-named-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}
  async create(createDishDto: CreateDishDto): Promise<Dish> {
    return this.dishRepository.save(createDishDto);
  }

  async findAll(query: FindAllNamedQueryDto): Promise<ListResultDto<Dish>> {
    const [result, totalCount] = await this.dishRepository.findAndCount({ ...query.toSQL() });
    return { result, totalCount };
  }

  async findOne(id: number): Promise<Dish> {
    const dish = await this.dishRepository.findOne(id);
    if (!dish) {
      throw new NotFoundException('Dish not found');
    }
    return dish;
  }

  async findMany(ids: number[]): Promise<Dish[]> {
    const dishes = await this.dishRepository.find({ where: { id: In(ids) } });
    if (!dishes) {
      throw new NotFoundException(`No dishes found`);
    }
    return dishes;
  }

  async update(id: number, updateDishDto: UpdateDishDto): Promise<Dish> {
    // await this.dishRepository.update(id, updateDishDto);
    // return this.findOne(id);
    // TODO need partial?
    return this.dishRepository.save<Partial<Dish>>({
      id,
      ...updateDishDto,
    });
  }

  async remove(id: number): Promise<number | undefined | null> {
    const res = await this.dishRepository.delete(id);
    return res.affected;
  }
}
