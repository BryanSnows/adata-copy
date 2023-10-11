import { ApiProperty } from "@nestjs/swagger";

export class ApprovedSerialsDto {
    @ApiProperty({
        type: [String],
    })
    approved_serials: string[];

    @ApiProperty()
    user_mes_id: number;
}