import { ApiProperty } from "@nestjs/swagger";

export class CreateCabinetDto {
    @ApiProperty()
    cabinet_name: string

    @ApiProperty()
    cabinet_side: number

}
