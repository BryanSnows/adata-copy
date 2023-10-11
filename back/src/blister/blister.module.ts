import { Module } from '@nestjs/common';
import { BlisterService } from './blister.service';
import { BlisterController } from './blister.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlisterEntity } from './entities/blister.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlisterEntity])
  ],
  controllers: [BlisterController],
  providers: [BlisterService]
})
export class BlisterModule {}
