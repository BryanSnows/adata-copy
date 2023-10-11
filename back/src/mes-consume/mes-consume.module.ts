import { MesConsumeController } from './mes-consume.controller';
import { MesConsumeService } from './mes-consume.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerialExceptionEntity } from './entities/serial-exception.entity';
import { TravelCardModule } from 'src/travel-card/travel-card.module';
import { WorkOrderSerialEntity } from 'src/travel-card/entities/workorder-serial.entity';
import { AxiosHttpModule } from 'src/config/http/http.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SerialExceptionEntity, WorkOrderSerialEntity]),
        TravelCardModule,
        AxiosHttpModule
    ],
    controllers: [
      MesConsumeController
    ],
    providers: [
      MesConsumeService
    ],
    exports: [
      MesConsumeService
    ]
})
export class MesConsumeModule { }
