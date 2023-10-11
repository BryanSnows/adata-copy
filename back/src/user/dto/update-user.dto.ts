import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto  {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    office_id: number

    @ApiProperty()
    user_enrollment: string

    @ApiProperty()
    user_profile_id: number

    @ApiProperty()
    user_shift_id: number;

    @ApiProperty()
    user_email: string;

    @ApiProperty()
    user_mes_id: number;

}
