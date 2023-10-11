import { ApiProperty } from "@nestjs/swagger";

export class FilterProductivityDateMst {

  @ApiProperty({required: false})
  mst_name: string;

  @ApiProperty({ required: false })
  start_date: string;

  @ApiProperty({ required: false })
  end_date: string;

}
