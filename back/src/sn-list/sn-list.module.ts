import { Module } from '@nestjs/common';
import { SnListService } from './sn-list.service';
import { SnListController } from './sn-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnList } from './entities/sn-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SnList])
  ],
  controllers: [SnListController],
  providers: [SnListService],
  exports: [SnListService]
})
export class SnListModule {}
