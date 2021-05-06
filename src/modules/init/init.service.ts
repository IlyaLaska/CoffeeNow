import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../common/modules/config/config.service';
import { CreateResourceDto } from '../resource/dto/create-resource.dto';
import { RolesEnum } from '../resource/enums/roles.enum';
import { ResourceService } from '../resource/resource.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class InitService {
  constructor(
    private resourceService: ResourceService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async adminInit(): Promise<string> {
    if (!this.configService.initEnabled || !this.configService.adminCredentials) {
      return 'Endpoint disabled';
    }
    // TODO decide what to do
    let admin = await this.resourceService.findByKey(RolesEnum.admin);
    if (!admin) {
      const createResourceDto: CreateResourceDto = {
        name: 'Administrator',
        key: RolesEnum.admin,
      };
      admin = await this.resourceService.create(createResourceDto);
    }
    const createUserDto: CreateUserDto = {
      name: 'Admin',
      email: this.configService.adminCredentials.email,
      password: this.configService.adminCredentials.password,
      resourceIds: [admin.id],
    };
    const user = await this.userService.create(createUserDto);
    return user ? `User ${user.name} created successfully` : 'An error occurred';
  }
}
