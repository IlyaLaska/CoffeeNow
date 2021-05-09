import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { IdParamDto } from '../../common/dto/id-param.dto';
import { ListResultDto } from '../../common/dto/list-result.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() query: FindAllQueryDto): Promise<ListResultDto<Order>> {
    return this.orderService.findAll(query);
  }

  @Get('/all')
  findAllWithCompleted(@Query() query: FindAllQueryDto): Promise<ListResultDto<Order>> {
    return this.orderService.findAllWithCompleted(query);
  }

  // TODO what to do with completed order security???
  @Get(':id')
  findOne(@Param() idParamDto: IdParamDto): Promise<Order> {
    return this.orderService.findOne(idParamDto.id);
  }

  @Put(':id')
  update(@Param() idParamDto: IdParamDto, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderService.update(idParamDto.id, updateOrderDto);
  }
  // TODO decide how to handle deletion
  @Delete(':id')
  remove(@Param() idParamDto: IdParamDto): Promise<number | undefined | null> {
    return this.orderService.remove(idParamDto.id);
  }
}
