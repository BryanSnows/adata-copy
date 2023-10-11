import { Controller, Get, Post, Body, Patch, Param, Query, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import Permission from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { MstService } from './mst.service';
import { CreateMstDto } from './dto/create-mst.dto';
import { FilterMstDto } from './dto/filter-mst.dto';
import { UpdateMstDto } from './dto/update-mst.dto';
import { MstEntity } from './entities/mst.entity';

@ApiTags('Mst')
@Controller('mst')
@ApiBearerAuth()
export class MstController {
  constructor(
    private readonly mstService: MstService
    ) {}

  @Post()
  @UseGuards(PermissionGuard(Permission.Mst.CREATE))
  create(@Body() createMstDto: CreateMstDto) {
    return this.mstService.create(createMstDto);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.Mst.READ))
  async findAll(@Query()
  filter: FilterMstDto): Promise<Pagination<MstEntity>> {
    return this.mstService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Mst.READ))
  findById(@Param('id') id: string) {
    return this.mstService.findById(+id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.Mst.UPDATE))
  update(@Param('id')id: number, @Body() updateMstDto: UpdateMstDto): Promise<MstEntity> {
    return this.mstService.update(+id, updateMstDto)
  }

  @Patch('status/:id')
  @UseGuards(PermissionGuard(Permission.Mst.CHANGE_STATUS))
   async changeStatus(@Param('id') id: number): Promise<MstEntity> {
    return this.mstService.changeStatus(id);
  }

}
