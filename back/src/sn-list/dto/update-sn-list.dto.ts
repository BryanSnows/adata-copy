import { PartialType } from '@nestjs/swagger';
import { CreateSnListDto } from './create-sn-list.dto';

export class UpdateSnListDto extends PartialType(CreateSnListDto) {}
