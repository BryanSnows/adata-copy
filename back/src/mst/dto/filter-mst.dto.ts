import { ApiProperty } from "@nestjs/swagger";

export class FilterMstDto {
  
  @ApiProperty({required: false, enum: [1, 0]})
  mst_status: number

  @ApiProperty({required: false})
  search_name: string

  @ApiProperty({required: false, enum: [1, 0]})
  mst_side: number

  @ApiProperty({ required: false, default: 1 })
  page: number

  @ApiProperty({ required: false, default: 10 })
  limit: number

  route: string
}