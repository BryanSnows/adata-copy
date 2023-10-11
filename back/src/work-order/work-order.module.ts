import { WorkOrderService } from './work-order.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkOrderEntity } from './entities/work-order.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WorkOrderEntity])],
    controllers: [],
    providers: [
        WorkOrderService
    ],
    exports: [
        WorkOrderService
    ]
})
export class WorkOrderModule { }
