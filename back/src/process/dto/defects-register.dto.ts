import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class DefectsRegisterDto {

    @ApiProperty({
        type: [String]
    })
    @IsArray()
    defect_serials: string[];
}