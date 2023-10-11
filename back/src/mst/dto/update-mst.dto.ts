import { PartialType } from '@nestjs/swagger';
import { CreateMstDto } from './create-mst.dto';

export class UpdateMstDto extends PartialType(CreateMstDto) {}
