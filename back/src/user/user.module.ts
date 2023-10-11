import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ProfileEntity } from '../access-control/entities/profile.entity';
import { ShiftEntity } from 'src/shift/entities/shift.entity';
import { OfficeEntity } from 'src/office/entities/office.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,ProfileEntity, ShiftEntity, OfficeEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
