import { ApiProperty } from "@nestjs/swagger";

export class FirstAccessDto {
    @ApiProperty({
        example: ('adata@' + (`${new Date().getFullYear()}`)),
      })
    current_password: string;

    @ApiProperty()
    new_password: string;

    @ApiProperty()
    confirmation_password: string;
}