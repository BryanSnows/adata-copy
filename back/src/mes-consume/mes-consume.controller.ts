import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MesConsumeService } from './mes-consume.service';
import { ApprovedSerialsDto } from './dto/approved-serials.dto';
import { CreateSerialExceptionDto } from './dto/create-serial-exception.dto';
import { FilterSerialException } from './dto/filter-serial-exception.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SerialExceptionEntity } from './entities/serial-exception.entity';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import Permission from 'src/auth/enums/permission.type';
import { ApprovedSerialsInterface } from './interface/approved-serials.interface';

@ApiTags('MES Consume')
@ApiBearerAuth()
@Controller('mes-consume')
export class MesConsumeController {
    constructor(
        private readonly mesConsumeService: MesConsumeService
    ) {}

    @Post('approved-serials')
    @UseGuards(PermissionGuard(Permission.SerialException.APPROVED_SERIAL))
    async addApprovedSerials(@Body() approvedSerialDto: ApprovedSerialsDto): Promise<ApprovedSerialsInterface> {
        return this.mesConsumeService.addApprovedSerials(approvedSerialDto, false);
    }

    @Get('get-work-order/:serial_number')
    @UseGuards(PermissionGuard(Permission.SerialException.GET_WORK_ORDER_BY_SERIAL))
    async getWorkOrderBySerial(@Param('serial_number') serial_number: string) {
        return this.mesConsumeService.getWorkOrderBySerial(serial_number);
    }

    @Post('serial-exception')
    @UseGuards(PermissionGuard(Permission.SerialException.CREATE_SERIAL_EXCEPTION))
    async createSerialException(@Body() createSerialExceptionDto: CreateSerialExceptionDto) {
        return this.mesConsumeService.createSerialException(createSerialExceptionDto);
    }

    @Get('serial-exception')
    @UseGuards(PermissionGuard(Permission.SerialException.READ_SERIAL_EXCEPTION))
    async getAllSerialExceptions(@Query() filter: FilterSerialException): Promise<Pagination<SerialExceptionEntity> | SerialExceptionEntity[]> {
        return this.mesConsumeService.getAllSerialExceptions(filter);
    }

    @Get('get-mes-user/:mes_user_id')
    @UseGuards(PermissionGuard(Permission.SerialException.GET_MES_USER))
    async getMesUserById(@Param('mes_user_id') mes_user_id: string) {
        return this.mesConsumeService.getMesUserById(+mes_user_id);
    }
}
