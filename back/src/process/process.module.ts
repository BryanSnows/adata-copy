import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { Module } from '@nestjs/common';
import { RedisModule } from 'src/config/cache/redis.module';
import { TravelCardModule } from 'src/travel-card/travel-card.module';
import { CabinetModule } from 'src/cabinet/cabinet.module';
import { MstModule } from 'src/mst/mst.module';
import { MesConsumeModule } from 'src/mes-consume/mes-consume.module';
import { SlotDefectModule } from 'src/slot-defect/slot-defect.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { SnListModule } from 'src/sn-list/sn-list.module';

@Module({
    imports: [
        RedisModule,
        TravelCardModule,
        CabinetModule,
        MstModule,
        MesConsumeModule,
        SlotDefectModule,
        WebsocketModule,
        SnListModule
    ],
    controllers: [
        ProcessController,
    ],
    providers: [
        ProcessService,
    ],
})
export class ProcessModule { }
