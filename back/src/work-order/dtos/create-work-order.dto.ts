import { ApiProperty, OmitType } from "@nestjs/swagger";
import { WorkOrderEntity } from "../entities/work-order.entity";

export class CreateWorkOrderDto extends OmitType(WorkOrderEntity, ['work_order_id', 'model_name', 'customer', 'rdt_time', 'fw', 'pn3']) {

    @ApiProperty()
    work_order_number: number;

    @ApiProperty()
    model_name?: string;

    @ApiProperty()
    customer?: string;

    @ApiProperty()
    rdt_time?: string;

    @ApiProperty()
    fw?: string;

    @ApiProperty()
    pn3?: number;
    
}