import { ApiProperty, OmitType } from "@nestjs/swagger"
import { WorkOrderSerialEntity } from "../entities/workorder-serial.entity";

export class CreateWorkOrderSerialDto extends OmitType(WorkOrderSerialEntity, ['workorder_serial_id']) {

  @ApiProperty()
  work_order_id: number;

  @ApiProperty()
  serial_id: number;

}