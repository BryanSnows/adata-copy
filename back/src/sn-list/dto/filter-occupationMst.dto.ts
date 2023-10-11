import { ApiProperty } from "@nestjs/swagger"
import { FilterPagination } from "src/shared/filter.pagination"

export class FpyOccupationMstDto {

  @ApiProperty({required: false})
  mst_name: string

  @ApiProperty({ required: false })
  start_date: string;

  @ApiProperty({ required: false })
  end_date: string;

}