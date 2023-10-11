import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
    @ApiProperty()
    enrollment: string;

    @ApiProperty()
    new_password: string;
}