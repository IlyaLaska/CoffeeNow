import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { UuidParamDto } from '../../common/dto/uuid-param.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query: FindAllQueryDto): Promise<ListResultDto<User>> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param() uuidParamDto: UuidParamDto): Promise<User> {
    return this.userService.findOne(uuidParamDto.id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User | void> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param() uuidParamDto: UuidParamDto, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    await this.userService.update(uuidParamDto.id, updateUserDto);
    return this.userService.findOne(uuidParamDto.id);
  }

  @Delete(':id')
  remove(@Param() uuidParamDto: UuidParamDto): Promise<number | undefined | null> {
    return this.userService.remove(uuidParamDto.id);
  }
}
