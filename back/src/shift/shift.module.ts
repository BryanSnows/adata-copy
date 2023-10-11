import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftEntity } from './entities/shift.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShiftEntity])
  ],
  controllers: [ShiftController],
  providers: [ShiftService], 
  exports: [ShiftService]
})
export class ShiftModule {}
