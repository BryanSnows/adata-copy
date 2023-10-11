import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import Permission from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreateSlotDefectDto } from './dtos/create-slot-defect.dto';
import { CabinetById } from './dtos/filter-cabinetById.dto';
import { FilterSlot } from './dtos/filter-slot-defect.dto';
import { UpdateStatusSlotDefectDto } from './dtos/update-status-slot-defect.dto';
import { SlotDefectEntity } from './entities/slot-defect.entity';
import { SlotDefectService } from './slot-defect.service';

@Controller('slot-defect')
@ApiTags('Slot Defect')
@ApiBearerAuth()
export class SlotDefectController {
    constructor(
        private readonly slotDefectService: SlotDefectService
    ) {}

    @Post()
    @UseGuards(PermissionGuard(Permission.SlotsDefects.CREATE))
    async create(@Body() createSlotDefectDto: CreateSlotDefectDto) {
        return this.slotDefectService.create(createSlotDefectDto, false);
    }

    @Get()
    @UseGuards(PermissionGuard(Permission.SlotsDefects.READ))
    async getAll(@Query()filter: FilterSlot): Promise<Pagination<SlotDefectEntity>> {
        return this.slotDefectService.getAll(filter);
    }

    @Get(':cabinet')
    @UseGuards(PermissionGuard(Permission.SlotsDefects.READ_BY_CABINET_ID))
    findByCabinet(@Query()filter: CabinetById): Promise<Pagination<SlotDefectEntity>> {
        return this.slotDefectService.findByCabinet(filter);
    }

    @Patch('status/:cabinet_id')
    @UseGuards(PermissionGuard(Permission.SlotsDefects.CHANGE_STATUS))
    async updateStatus(@Param('cabinet_id') cabinet_id: number, @Body() updateStatusSlotDefectDto: UpdateStatusSlotDefectDto) {
        return this.slotDefectService.updateStatus(cabinet_id, updateStatusSlotDefectDto);
    }
}
