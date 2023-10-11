import { ApiProperty } from "@nestjs/swagger"

export class ChangeUserDto {

    @ApiProperty()
    user_registration: string

    @ApiProperty()
    currentPassword: string

    @ApiProperty()
    firstPass: string

    @ApiProperty()
    secondPass: string


}
