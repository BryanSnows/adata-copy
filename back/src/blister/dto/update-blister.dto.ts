import { PartialType } from '@nestjs/swagger';
import { CreateBlisterDto } from './create-blister.dto';

export class UpdateBlisterDto extends PartialType(CreateBlisterDto) {}
