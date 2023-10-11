import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ShiftEntity } from './entities/shift.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FilterShiftDto } from './dto/filter.shift';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { LimitOnUpdateNotSupportedError } from 'typeorm';


@Controller('shift')
@ApiTags('Shift')
@ApiBearerAuth()
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  
  @Post()
   @UseGuards(PermissionGuard(Permission.Shift.CREATE))
   async create(@Body() createShiftDto: CreateShiftDto): Promise<ShiftEntity> {
    return this.shiftService.create(createShiftDto);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.Shift.READ))
  async findAll(@Query() filter: FilterShiftDto): Promise<Pagination<ShiftEntity>> {
    return this.shiftService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Shift.READ))
  async findOne(@Param('id') id: string) {
    return this.shiftService.findById(+id);
  }
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.User.UPDATE))
  async update(
    @Param('id') id: string,
    @Body() updateShiftDto: UpdateShiftDto
  ): Promise<ShiftEntity> {
    return this.shiftService.update(+id, updateShiftDto);
  }
  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.Shift.CHANGE_STATUS))
  async changeStatus(@Param('id') id: number):
   Promise<ShiftEntity> {
    return this.shiftService.changeStatus(id);
  }

}
