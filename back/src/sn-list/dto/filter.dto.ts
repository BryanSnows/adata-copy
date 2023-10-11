import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/shared/filter.pagination";

export class FilterSnListDto {

    @ApiProperty({required: false})
    serial_number: string;
  
    @ApiProperty({ required: false })
    created_at: string;

    @ApiProperty({required: false})
    start_hour: string

    @ApiProperty({required: false})
    end_hour: string

    @ApiProperty({ required: false, enum: [1, 0]})
    status: number;

    @ApiProperty({ required: false })
    mst_name: string;

    @ApiProperty({ required: false, default: 1 })
    page: number

    @ApiProperty({ required: false, default: 10 })
    limit: number
    

}
