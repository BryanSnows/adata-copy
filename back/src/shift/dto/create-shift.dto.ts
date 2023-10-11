import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";



export class CreateShiftDto {

    @ApiProperty()
    shift_name: string

    @ApiHideProperty()
    shift_status: boolean
}
