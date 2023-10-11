import { Controller, Get, Post, Body, Patch, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import Permission from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CabinetService } from './cabinet.service';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { FilterCabinetDto } from './dto/filter-cabinet.dto';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { CabinetEntity } from './entities/cabinet.entity';


@ApiTags('Cabinet')
@Controller('cabinet')
@ApiBearerAuth()
export class CabinetController {
  constructor(private readonly cabinetService: CabinetService) {}


  @Post()
  @UseGuards(PermissionGuard(Permission.Cabinet.CREATE))
  async create(@Body() createCabinetDto: CreateCabinetDto): Promise<CabinetEntity> {
    const cabinetCreate = await this.cabinetService.create(createCabinetDto)
    return cabinetCreate
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.Cabinet.READ))
  async findAll(@Query()
    filter: FilterCabinetDto): Promise<any | Pagination<CabinetEntity>> {
    return this.cabinetService.findAll(filter);
  }

  
  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Cabinet.READ))
  findByCabinetId(@Param('id') id: string): Promise< any | CabinetEntity>{
    return this.cabinetService.findByCabinetId(+id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.Cabinet.UPDATE))
  async update(@Param('id') id: number, @Body() updateCabinetDto: UpdateCabinetDto): Promise< any | CabinetEntity> {
    const cabinetUpdate =  await this.cabinetService.update(+id, updateCabinetDto)
    return cabinetUpdate
  }

  @Patch('status/:id')
  @UseGuards(PermissionGuard(Permission.Cabinet.CHANGE_STATUS))
  async changeStatus(@Param('id') id: number): Promise<CabinetEntity> {
    return this.cabinetService.changeStatus(id);
  }

  @Get('total-cabinet-capacity/:cabinet_id')
  async getTotalCabinetCapacity(@Param('cabinet_id') cabinet_id: number): Promise<number> {
    return this.cabinetService.getTotalCabinetCapacity(cabinet_id);
  }

}
