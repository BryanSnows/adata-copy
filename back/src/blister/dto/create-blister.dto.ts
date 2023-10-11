import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";



export class CreateBlisterDto {

    @ApiProperty()
    blister_name: string

    @ApiProperty()
    blister_img: string

    @ApiProperty()
    blister_qtd: string

    @ApiProperty()
    blister_status: boolean
}
