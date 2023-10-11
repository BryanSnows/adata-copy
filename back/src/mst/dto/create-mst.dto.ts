import { ApiProperty } from "@nestjs/swagger";


export class CreateMstDto {

  @ApiProperty()
  mst_name: string;

  @ApiProperty()
  mst_side: number;

  @ApiProperty()
  mst_ip: string;

  @ApiProperty()
  mst_status: boolean;

}
