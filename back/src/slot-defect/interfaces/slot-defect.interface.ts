import { OmitType } from "@nestjs/swagger";
import { SlotDefectEntity } from "../entities/slot-defect.entity";

export class SlotDefectInterface extends OmitType(SlotDefectEntity, []) {
    slot_defect_id: number;
    cabinet_name: string;
    position: number;
    count: number;
    status: boolean;
    user_name: string;
}