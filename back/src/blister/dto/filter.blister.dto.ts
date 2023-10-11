import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/shared/filter.pagination";

export class FilterBlister extends FilterPagination {

    @ApiProperty({required: false, default: 10 })
    limit: number

    @ApiProperty({ required: false, default: 'ASC', enum: ['ASC', 'DESC'] })
    sort: string

    @ApiProperty({required: false, default: 'ID', enum: ['ID', 'NAME']})
    orderBy: string;

    @ApiProperty({required: false})
    blister_name: string

    @ApiProperty({required: false, enum: [1, 0]})
    blister_status: number

}