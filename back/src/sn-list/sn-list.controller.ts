import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SnListService } from './sn-list.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SnList } from './entities/sn-list.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FilterSnListDto } from './dto/filter.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { FilterProductivityHourMst } from './dto/filter-productivity-hour-mst';
import { FilterProductivityDateMst } from './dto/filter-productivity-date';
import { FpyOccupationMstDto } from './dto/filter-occupationMst.dto';

@ApiTags('Sn List')
@ApiBearerAuth()
@Controller('sn-list')
export class SnListController {
  constructor(private readonly snListService: SnListService) {}

  @Get('productivity-hour')
  @UseGuards(PermissionGuard(Permission.Productivity.READ))
  async getProductivityHour(@Query() filter: FilterProductivityHourMst): Promise<SnList[]> {
      return await this.snListService.getProductivityHour(filter)
  }

  @Get('productivity-mst')
  @UseGuards(PermissionGuard(Permission.Productivity.READ))
  async getProductivityMst(@Query() filter: FilterProductivityDateMst): Promise<SnList[]> {
    return await this.snListService.getProductivityMst(filter)
  }


  @Get()
  @UseGuards(PermissionGuard(Permission.SnList.READ))
  async findAll(@Query()filter: FilterSnListDto): Promise<any | Pagination<SnList>>{
    return this.snListService.findAll(filter);
  }
  
  @Get(':serial')
  @UseGuards(PermissionGuard(Permission.SnList.READ))
  findBySerial(@Param('serial') serial: string) {
    return this.snListService.findBySerial(serial);
  }

  @Get('occupation/history')
  @UseGuards(PermissionGuard(Permission.Occupation.READ))
  async test(@Query() filter: FpyOccupationMstDto): Promise<SnList[]> {
      return await this.snListService.group_data_occupation(filter);
  }
}
