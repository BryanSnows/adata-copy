import { MesApiController } from './mes-api.controller';
import { MesApiService } from './mes-api.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        MesApiController
    ],
    providers: [
        MesApiService
    ],
})
export class MesApiModule { }
