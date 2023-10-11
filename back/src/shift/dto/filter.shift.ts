import { ApiProperty } from "@nestjs/swagger"
import { FilterPagination } from "src/shared/filter.pagination"

export class FilterShiftDto extends FilterPagination{
    
  @ApiProperty({required: false })
  search_name: string

  @ApiProperty({required: false, enum: [1, 0]})
  shift_status: number

  @ApiProperty({ required: false, default: 'NAME', enum: ['NAME'] })
  orderBy: string

}