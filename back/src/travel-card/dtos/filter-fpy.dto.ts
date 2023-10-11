import { ApiProperty } from "@nestjs/swagger"
import { FilterPagination } from "src/shared/filter.pagination"

export class FpyFilterDto {

  @ApiProperty({required: false})
  mst_id: number

  @ApiProperty({ required: false })
  start_date: string;

  @ApiProperty({ required: false })
  end_date: string;

}