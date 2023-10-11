import { ApiProperty, OmitType } from "@nestjs/swagger";
import { SerialEntity } from "../entities/serial.entity";

export class CreateSerialDto extends SerialEntity {

    @ApiProperty()
    serial_id: number;

    @ApiProperty()
    serial_number: string;
    
}