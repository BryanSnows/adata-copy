import { TravelCardService } from './travel-card.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelCardEntity } from './entities/travel-card.entity';
import { RedisModule } from 'src/config/cache/redis.module';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { MstModule } from 'src/mst/mst.module';
import { TravelCardController } from './travel-card.controller';
import { SerialModule } from 'src/serial/serial.module';
import { WorkOrderModule } from 'src/work-order/work-order.module';
import { WorkOrderSerialEntity } from './entities/workorder-serial.entity';

@Module({
    imports: [
        RedisModule,
        CabinetModule,
        MstModule,
        SerialModule,
        WorkOrderModule,
        TypeOrmModule.forFeature([TravelCardEntity, WorkOrderSerialEntity]),
    ],
    controllers: [TravelCardController],
    providers: [
        TravelCardService
    ],
    exports: [
        TravelCardService
    ]
})
export class TravelCardModule { }
