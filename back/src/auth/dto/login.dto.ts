import { ApiProperty } from "@nestjs/swagger"


export class LoginDTO{

    @ApiProperty()
    enrollment: string

    @ApiProperty()
    password: string

}