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
    private resourceService: RoleService,
    private firebaseService: FirebaseService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | void> {
    try {
      const id = uuid();
      const resources = await this.resourceService.findByIds(createUserDto.roleIds);
      const resourceUrls = resources.map((resource) => resource.key);
      await this.firebaseService.create({
        uid: id,
        email: createUserDto.email,
        displayName: createUserDto.name,
        password: createUserDto.password,
        resourceKeys: resourceUrls,
      });
      return this.userRepository.save<Partial<User>>({
        id,
        resources,
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
    const [result, totalCount] = await this.userRepository.findAndCount({ ...query.toSQL(), relations: ['resources'] });
    return { result, totalCount };
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.userRepository.findOne(uuid, { relations: ['resources'] });
    if (!user) {
      throw new NotFoundException(`User with uuid ${uuid} not found`);
    }
    return user;
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const ownedResourceKeys = (await this.findOne(uuid)).resources.map((resource) => {
      return resource.key;
    });
    const resources = updateUserDto.roleIds ? await this.resourceService.findByIds(updateUserDto.roleIds) : undefined;
    const resourceKeys = resources ? resources.map((resource) => resource.key) : undefined;
    if (
      resourceKeys &&
      ownedResourceKeys.some((ownedKey) => {
        return !resourceKeys.includes(ownedKey);
      })
    ) {
      await this.firebaseService.revokeToken(uuid);
    }
    await this.firebaseService.update({
      uid: uuid,
      displayName: updateUserDto.name,
      resourceKeys: resourceKeys,
    });
    return this.userRepository.save<Partial<User>>({
      id: uuid,
      resources,
      ...updateUserDto,
    });
  }

  async remove(uuid: string): Promise<number | undefined | null> {
    await this.firebaseService.remove(uuid);
    const res = await this.userRepository.delete(uuid);
    return res.affected;
  }
}
