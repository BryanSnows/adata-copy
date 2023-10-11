import { ApiHideProperty, ApiProperty, OmitType } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import { SlotDefectEntity } from "../entities/slot-defect.entity";

class SlotDefectDto extends OmitType(SlotDefectEntity, ['slot_defect_id', 'count', 'status', 'cabinet', 'cabinet_id']) {

    @ApiProperty()
    @IsString()
    cabinet_name?: string;

    @ApiProperty()
    @IsNumber()
    position: number;

    @ApiProperty()
    @IsString()
    user_name: string;
    
    @ApiHideProperty()
    @IsNumber()
    count: number;

    @ApiHideProperty()
    @IsBoolean()
    status: boolean;
}

export class CreateSlotDefectDto {
    @ApiProperty({
        type: [SlotDefectDto]
    })
    slot_defects: SlotDefectDto[]
}