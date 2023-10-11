import { forwardRef, Module } from '@nestjs/common';
import { CabinetService } from './cabinet.service';
import { CabinetController } from './cabinet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabinetEntity } from './entities/cabinet.entity';
import { SlotDefectModule } from 'src/slot-defect/slot-defect.module';
import { RedisModule } from 'src/config/cache/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CabinetEntity]),
    forwardRef(() => SlotDefectModule),
    RedisModule
  ],
  controllers: [CabinetController],
  providers: [CabinetService],
  exports: [CabinetService]
})
export class CabinetModule {}
