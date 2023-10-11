import { ApiProperty, OmitType } from "@nestjs/swagger";
import { FilterPagination } from "src/shared/filter.pagination";

export class FilterSerialException extends OmitType(FilterPagination, ['orderBy']) {
    @ApiProperty({ required: false })
    search: string;

    @ApiProperty({ required: false, enum: [1, 0], default: 0 })
    resent: number;
}