import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/shared/filter.pagination";

export class FilterSlot {

    @ApiProperty({required: false})
    search: string;

    @ApiProperty({ required: false, default: 1 })
    page: number

    @ApiProperty({ required: false, default: 10 })
    limit: number
    

}
