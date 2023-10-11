import {ApiProperty} from "@nestjs/swagger"
import { Transform } from "class-transformer";
import { FilterPagination } from "src/shared/filter.pagination";

export class FilterUser extends FilterPagination{


    @ApiProperty({ required: false })
    search_name: string

    @ApiProperty({ required: false, enum: [1, 0] })
    user_status: number;

    @ApiProperty({ required: false, default: 'NAME', enum: ['NAME'] })
    orderBy: string





}