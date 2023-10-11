import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/shared/filter.pagination";


export class FilterTravelCardDto {
  
  
    @ApiProperty({required: false})
    serial_number: string;
  
    @ApiProperty({ required: false })
    start_date: string;
  
    @ApiProperty({ required: false })
    end_date: string;

    
    @ApiProperty({ required: false, default: 1 })
    page: number

    @ApiProperty({ required: false, default: 10 })
    limit: number
}