import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/shared/filter.pagination";

export class CabinetById {

    @ApiProperty({required: true})
    cabinet_name: string;

    @ApiProperty({required: false})
    search: number;

    @ApiProperty({ required: false, default: 1 })
    page: number

    @ApiProperty({ required: false, default: 10 })
    limit: number
    

}
