import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { FirebaseService } from '../../common/modules/firebase/firebase.service';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleService: RoleService,
    private firebaseService: FirebaseService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | void> {
    try {
      const id = uuid();
      const roles = await this.roleService.findByIds(createUserDto.roleIds);
      const roleUrls = roles.map((role) => role.key);
      await this.firebaseService.create({
        uid: id,
        email: createUserDto.email,
        displayName: createUserDto.name,
        password: createUserDto.password,
        roleKeys: roleUrls,
      });
      return this.userRepository.save<Partial<User>>({
        id,
        roles,
        name: createUserDto.name,
        initialEmail: createUserDto.email,
      });
    } catch (e) {
      if (e.response.statusCode === 409) {
        throw new ConflictException(e.response.message);
      } else {
        throw e;
      }
    }
  }

  async findAll(query: FindAllQueryDto): Promise<ListResultDto<User>> {
    const [result, totalCount] = await this.userRepository.findAndCount({ ...query.toSQL(), relations: ['roles'] });
    return { result, totalCount };
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne(uuid, { relations: ['roles'] });
    if (!user) {
      throw new NotFoundException(`User with uuid ${uuid} not found`);
    }
    return user;
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const ownedRoleKeys = (await this.findOne(uuid)).roles.map((role) => {
      return role.key;
    });
    const roles = updateUserDto.roleIds ? await this.roleService.findByIds(updateUserDto.roleIds) : undefined;
    const roleKeys = roles ? roles.map((role) => role.key) : undefined;
    if (
      roleKeys &&
      ownedRoleKeys.some((ownedKey) => {
        return !roleKeys.includes(ownedKey);
      })
    ) {
      await this.firebaseService.revokeToken(uuid);
    }
    await this.firebaseService.update({
      uid: uuid,
      displayName: updateUserDto.name,
      roleKeys: roleKeys,
    });
    return this.userRepository.save<Partial<User>>({
      id: uuid,
      roles,
      ...updateUserDto,
    });
  }

  async remove(uuid: string): Promise<number | undefined | null> {
    await this.firebaseService.remove(uuid);
    const res = await this.userRepository.delete(uuid);
    return res.affected;
  }
}
