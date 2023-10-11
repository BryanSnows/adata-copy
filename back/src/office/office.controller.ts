import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { OfficeEntity } from './entities/office.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilterOffice } from './dto/filter.office.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';

@Controller('office')
@ApiTags('Office')
@ApiBearerAuth()
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @UseGuards(PermissionGuard(Permission.Office.CREATE))
  async create(@Body() createOfficeDto: CreateOfficeDto): Promise<OfficeEntity> {
    return this.officeService.create(createOfficeDto);
  }
  @Get()
  @UseGuards(PermissionGuard(Permission.Office.READ))
  async findAll(@Query() filter: FilterOffice): Promise<Pagination<OfficeEntity>> {
    return this.officeService.findAll(filter);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.User.UPDATE))
  async update(
    @Param('id') id: string,
    @Body() updateOfficeDto: UpdateOfficeDto
  ): Promise<OfficeEntity> {
    return this.officeService.update(+id, updateOfficeDto);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Office.READ))
  async findById(@Param('id') id: number): Promise<OfficeEntity>{
    return this.officeService.findById(id)
  }

  @Patch('status/:id')
  @UseGuards(PermissionGuard(Permission.Office.CHANGE_STATUS))
  async changeStatus(@Param('id') id: number): Promise<OfficeEntity> {
    return this.officeService.changeStatus(id);
  }

}
