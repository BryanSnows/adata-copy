import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { BlisterService } from './blister.service';
import { CreateBlisterDto } from './dto/create-blister.dto';
import { FilterBlister } from './dto/filter.blister.dto';
import { UpdateBlisterDto } from './dto/update-blister.dto';
import { BlisterEntity } from './entities/blister.entity';
import * as bodyParser from 'body-parser';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';

@Controller('blister')
@ApiTags('Blister')
@ApiBearerAuth()
export class BlisterController {
  constructor(private readonly blisterService: BlisterService) {}

  @Post()  
  @UseGuards(PermissionGuard(Permission.Blister.CREATE))
  create(@Body() createBlisterDto: CreateBlisterDto) {
    return this.blisterService.create(createBlisterDto);
  }

  @Get()
  @UseGuards(PermissionGuard(Permission.Blister.READ))
  async findAll(
    @Query() filter: FilterBlister
  ): Promise<Pagination<BlisterEntity>> {
    return this.blisterService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(Permission.Blister.READ))
  findOne(@Param('id') id: string) {
    return this.blisterService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(Permission.User.UPDATE))
  async update(
    @Param('id') id: string,
    @Body() updateBlisterDto: UpdateBlisterDto
    ): Promise<BlisterEntity> {
      return this.blisterService.update(+id, updateBlisterDto)
    } 

    @Patch('status/:id')
    @UseGuards(PermissionGuard(Permission.Blister.CHANGE_STATUS))
    async changeStatus(@Param('id') id: number) {
      return this.blisterService.changeStatusBlister(id)
    }

    


}
