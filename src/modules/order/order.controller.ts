import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { IdParamDto } from '../../common/dto/id-param.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { RoleEnum } from '../role/enums/role.enum';
import { CodeParamDto } from './dto/code-param.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Public()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Post('/confirm')
  @Public()
  paymentConfirm(@Body() msg: any): Promise<undefined> {
    return this.orderService.paymentConfirm(msg);
  }

  @Get()
  @Roles(RoleEnum.employee)
  findAll(@Query() query: FindAllQueryDto): Promise<ListResultDto<Order>> {
    return this.orderService.findAll(query);
  }

  @Get('/all')
  @Roles(RoleEnum.admin)
  findAllWithCompleted(@Query() query: FindAllQueryDto): Promise<ListResultDto<Order>> {
    return this.orderService.findAllWithCompleted(query);
  }

  @Get(':id')
  @Roles(RoleEnum.admin, RoleEnum.employee)
  findOne(@Param() idParamDto: IdParamDto): Promise<Order> {
    return this.orderService.findOne(idParamDto.id);
  }

  @Get('/code/:code')
  @Public()
  @Roles(RoleEnum.admin, RoleEnum.employee)
  findOneByCode(@Param() codeParamDto: CodeParamDto): Promise<Order | undefined> {
    return this.orderService.findByCode(codeParamDto.code);
  }

  @Put(':id')
  @Roles(RoleEnum.admin, RoleEnum.employee)
  update(@Param() idParamDto: IdParamDto, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderService.update(idParamDto.id, updateOrderDto);
  }
  // TODO decide how to handle deletion
  @Delete(':id')
  @Roles(RoleEnum.admin)
  remove(@Param() idParamDto: IdParamDto): Promise<number | undefined | null> {
    return this.orderService.remove(idParamDto.id);
  }
}
