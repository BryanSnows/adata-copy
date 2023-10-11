import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsNumber, IsString } from "class-validator";
import { CachedSlots } from "src/shared/interfaces/cached-process.interface";

class SlotsDto implements CachedSlots {
    
    @ApiHideProperty()
    @IsNumber()
    work_order_number: number;

    @ApiHideProperty()
    @IsString()
    cabinet_name: string;

    @ApiHideProperty()
    @IsString()
    mst_name: string;

    @ApiProperty()
    @IsString()
    serial_number: string;

    @ApiProperty()
    @IsNumber()
    position: number;

    @ApiHideProperty()
    @IsNumber()
    test_serial_count: number;

    @ApiHideProperty()
    @IsNumber()
    test_position_count: number;

    @ApiHideProperty()
    @IsNumber()
    situation_id: number;

    @ApiHideProperty()
    @IsDate()
    created_at: Date;

    @ApiHideProperty()
    status: null | boolean;
}

export class PutOnCabinetDto {

    @ApiProperty()
    cabinet_name: string;

    @ApiProperty({
        type: [SlotsDto]
    })
    @IsArray()
    slots: SlotsDto[];

    @ApiProperty()
    user_mes_id: number;

    @ApiProperty({
        default: false
    })
    is_filled_cabinet: boolean;
}