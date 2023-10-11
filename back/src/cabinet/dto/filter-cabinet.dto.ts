import { ApiProperty } from "@nestjs/swagger";

export class FilterCabinetDto {
    @ApiProperty({required: false, enum: [1, 0]})
    cabinet_status: number

    @ApiProperty({ required: false})
    cabinet_name: string

    @ApiProperty({required: false, enum: [1, 0]})
    cabinet_side: number

    @ApiProperty({ required: false, default: 1 })
    page: number

    @ApiProperty({ required: false, default: 10 })
    limit: number

}