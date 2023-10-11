import { ApiProperty } from "@nestjs/swagger";

export class FilterProductivityHourMst {
  @ApiProperty({required: false})
  mst_name: string

  @ApiProperty({required: false})
  created_at: string

  @ApiProperty({required: false})
  start_hour: number


  @ApiProperty({required: false})
  end_hour: number


}
