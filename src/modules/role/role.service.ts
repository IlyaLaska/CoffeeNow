import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    if (
      await this.roleRepository.findOne({
        where: { key: createRoleDto.key },
      })
    ) {
      throw new ConflictException('This key already exists');
    } else {
      return this.roleRepository.save<Partial<Role>>({
        ...createRoleDto,
      });
    }
  }

  async findAll(query: FindAllQueryDto): Promise<ListResultDto<Role>> {
    const [result, totalCount] = await this.roleRepository.findAndCount({ ...query.toSQL() });
    return { result, totalCount };
  }

  async findByIds(ids: number[]): Promise<Role[]> {
    return await this.roleRepository.findByIds(ids);
  }

  async findByKey(key: string): Promise<Role | undefined> {
    return await this.roleRepository.findOne({ where: { key: key } });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with id [${id}] not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.roleRepository.save({
      id,
      ...updateRoleDto,
    });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<number | undefined | null> {
    const role = await this.roleRepository.findOne({ where: { id }, relations: ['users'] });
    if (role?.users.length) {
      throw new ConflictException(`Cannot delete role, since it is related to users: ${JSON.stringify(role.users)}`);
    }
    const res = await this.roleRepository.delete(id);
    return res.affected;
  }
}
