import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkOrderDto } from './dtos/create-work-order.dto';
import { WorkOrderEntity } from './entities/work-order.entity';

@Injectable()
export class WorkOrderService { 
    constructor(
        @InjectRepository(WorkOrderEntity)
        private readonly workOrderRepository: Repository<WorkOrderEntity>
    ) {}

    async createWorkOrder(createWorkOrderDto: CreateWorkOrderDto) {
        return this.workOrderRepository.save(createWorkOrderDto);
    }

    async getWorkOrderByNumber(work_order_number: number) {
        return this.workOrderRepository.findOne({
            where: {
                work_order_number: work_order_number
            }
        });
    }
}
