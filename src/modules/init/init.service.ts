import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../common/modules/config/config.service';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { RoleService } from '../role/role.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class InitService {
  constructor(
    private resourceService: RoleService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async adminInit(): Promise<string> {
    if (!this.configService.initEnabled || !this.configService.adminCredentials) {
      return 'Endpoint disabled';
    }
    // TODO decide what to do
    let admin = await this.resourceService.findByKey(RoleEnum.admin);
    if (!admin) {
      const createResourceDto: CreateRoleDto = {
        name: 'Administrator',
        key: RoleEnum.admin,
      };
      admin = await this.resourceService.create(createResourceDto);
    }
    const createUserDto: CreateUserDto = {
      name: 'Admin',
      email: this.configService.adminCredentials.email,
      password: this.configService.adminCredentials.password,
      roleIds: [admin.id],
    };
    const user = await this.userService.create(createUserDto);
    return user ? `User ${user.name} created successfully` : 'An error occurred';
  }
}
