import { SlotDefectController } from './slot-defect.controller';
import { SlotDefectService } from './slot-defect.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotDefectEntity } from './entities/slot-defect.entity';
import { CabinetModule } from 'src/cabinet/cabinet.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SlotDefectEntity]),
        CabinetModule
    ],
    controllers: [
        SlotDefectController
    ],
    providers: [
        SlotDefectService
    ],
    exports: [
        SlotDefectService
    ]
})
export class SlotDefectModule { }
