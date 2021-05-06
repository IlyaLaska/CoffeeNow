import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    if (
      await this.resourceRepository.findOne({
        where: { key: createResourceDto.key },
      })
    ) {
      throw new ConflictException('This key already exists');
    } else
      return this.resourceRepository.save<Partial<Resource>>({
        ...createResourceDto,
      });
  }

  async findAll(query: FindAllQueryDto): Promise<ListResultDto<Resource>> {
    const [result, totalCount] = await this.resourceRepository.findAndCount({ ...query.toSQL() });
    return { result, totalCount };
  }

  async findByIds(ids: number[]): Promise<Resource[]> {
    return await this.resourceRepository.findByIds(ids);
  }

  async findByKey(key: string): Promise<Resource | undefined> {
    return await this.resourceRepository.findOne({ where: { key: key } });
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne(id);
    if (!resource) {
      throw new NotFoundException(`Resource with id [${id}] not found`);
    }
    return resource;
  }

  async update(id: number, updateResourceDto: UpdateResourceDto): Promise<Resource> {
    await this.findOne(id);
    return this.resourceRepository.save<Partial<Resource>>({
      id,
      ...updateResourceDto,
    });
  }

  async remove(id: number): Promise<number | undefined | null> {
    const resource = await this.resourceRepository.findOne({ where: { id }, relations: ['users'] });
    if (resource?.users.length) {
      throw new ConflictException(
        `Cannot delete resource, since it is related to users: ${JSON.stringify(resource.users)}`,
      );
    }
    const res = await this.resourceRepository.delete(id);
    return res.affected;
  }
}
