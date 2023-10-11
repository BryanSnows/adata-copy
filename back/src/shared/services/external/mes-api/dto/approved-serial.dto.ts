import { ApiProperty } from "@nestjs/swagger";

export class ApprovedSerialDto {
    @ApiProperty({
        type: [String]
    })
    approved_serials: string[];
}