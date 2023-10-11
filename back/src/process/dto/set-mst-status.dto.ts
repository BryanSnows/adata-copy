import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class SetMstStatusDto {

    @ApiProperty()
    @IsBoolean()
    status: boolean;
}