import { ApiProperty } from "@nestjs/swagger";

export class CreateSerialExceptionDto {

    @ApiProperty({
        type: [String]
    })
    serial_numbers: string[];
    
}