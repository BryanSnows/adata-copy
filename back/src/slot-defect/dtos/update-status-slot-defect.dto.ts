import { ApiProperty, OmitType } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { SlotDefectEntity } from "../entities/slot-defect.entity";

export class UpdateStatusSlotDefectDto extends OmitType(SlotDefectEntity, ['cabinet_id', 'slot_defect_id', 'count', 'status']) {

    @ApiProperty()
    @IsNumber()
    position: number;
    
}