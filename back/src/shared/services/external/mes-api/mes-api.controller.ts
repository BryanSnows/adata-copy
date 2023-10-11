import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { MesApiService } from './mes-api.service';

@ApiTags('MES API')
@PublicRoute()
@Controller('mes-api')
export class MesApiController {
    constructor(
        private readonly mesApiService: MesApiService
    ) {}

    @Get('approved-serials')
    async addAprovedSerials() {
        return this.mesApiService.addAprovedSerials();
    }

    @Get('get-work-order')
    async getWorkOrderBySerial(
        @Query('value') value: string
    ) {
        const serial_number = value.split(':')[1];
        return this.mesApiService.getWorkOrderBySerial(serial_number);
    }

    @Get('get-work-order-info')
    async getWorkOrderInfo(
        @Query('value') value: string
    ) {
        const work_order_number = value.split(':')[1];
        return this.mesApiService.getWorkOrderInfo(work_order_number);
    }

    @Get('get-mes-user-by-id')
    async getMesUserById(
        @Query('value') value: string
    ) {
        const user_mes_id = value.split(':')[1];
        return this.mesApiService.getMesUserById(user_mes_id);
    }
 }
