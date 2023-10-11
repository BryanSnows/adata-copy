import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Permission from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { CreateSlotDefectDto } from 'src/slot-defect/dtos/create-slot-defect.dto';
import { SlotDefectService } from 'src/slot-defect/slot-defect.service';
import { DefectsRegisterDto } from './dto/defects-register.dto';
import { PutOnCabinetDto } from './dto/put-ssd-on-cabinet.dto';
import { SetMstStatusDto } from './dto/set-mst-status.dto';
import { ProcessService } from './process.service';

@Controller('process')
@ApiTags('Process')
export class ProcessController {
    constructor(
        private readonly processService: ProcessService,
        private readonly slotDefectService: SlotDefectService
    ) {}

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Post('verify-valid-serials')
    async verifyValidSerials(@Body() serial_numbers: string[]) {
        return this.processService.verifyValidSerials(serial_numbers);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Post('put-on-cabinet')
    async setOnCabinet(@Body() putOnCabinetDto: PutOnCabinetDto) {
        return this.processService.setOnCabinet(putOnCabinetDto);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Get('available-mst/:mst_side')
    async availableMst(@Param('mst_side') mst_side: string) {
        return this.processService.availableMst(+mst_side);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Post('set-mst-status/:mst_name')
    async setMstStatus(@Param('mst_name') mst_name: string, @Body() setMstStatusDto: SetMstStatusDto) {
        return this.processService.setMstStatus(mst_name, setMstStatusDto);
    }

    @ApiBearerAuth()
    @UseGuards(PermissionGuard(Permission.Process.DEFECTS_REGISTER))
    @Post('defects-register/:cabinet_name')
    async defectsRegister(@Param('cabinet_name') cabinet_name: string, @Body() defectsRegisterDto: DefectsRegisterDto) {
        return this.processService.defectsRegister(cabinet_name, defectsRegisterDto);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Get('defect-positions/:cabinet_name')
    async defectPositions(@Param('cabinet_name') cabinet_name: string) {
        return this.processService.defectPositions(cabinet_name);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Patch('allow-new-work-order')
    async allowNewWorkOrder() {
        return this.processService.allowNewWorkOrder();
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Post('create-new-work-order-exception-queue/:work_order_number')
    async createNewWorkOrderExceptionQueue(@Param('work_order_number') work_order_number: string) {
        return this.processService.createNewWorkOrderExceptionQueue(+work_order_number);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Get('cached-processes')
    async cachedProcesses() {
        return this.processService.cachedProcesses();
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Get('cached-queue')
    async cachedQueue() {
        return this.processService.cachedQueue();
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Get('verify-mes-user/:user_mes_id')
    async verifyMesUserById(@Param('user_mes_id') user_mes_id: string) {
        return this.processService.verifyMesUserById(+user_mes_id);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Post('slot-defect')
    async create(@Body() createSlotDefectDto: CreateSlotDefectDto) {
        return this.slotDefectService.create(createSlotDefectDto, false);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Get('get-mapped-test-positions/:cabinet_name')
    async getMappedTestPositions(@Param('cabinet_name') cabinet_name: string) {
        return this.processService.getMappedTestPositions(cabinet_name);
    }

    @PublicRoute()
    @UseGuards(AuthGuard('basic'))
    @ApiBasicAuth()
    @Delete('clear-processes')
    async clearProcesses() {
        return this.processService.clearProcesses();
    }

}
