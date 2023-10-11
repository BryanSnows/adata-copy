import { Module } from '@nestjs/common';
import { MstService } from './mst.service';
import { MstController } from './mst.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MstEntity } from './entities/mst.entity';
import { RedisModule } from 'src/config/cache/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MstEntity]),
    RedisModule
  ],
  controllers: [MstController],
  providers: [MstService],
  exports: [
    MstService
  ]
})
export class MstModule {}
