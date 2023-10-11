import { Body, Controller, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import Permission from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { ChangeProfileArrayDto } from './dto/change-profile.dto';
import { ProfileTransactionEntity } from './entities/profile-transaction.entity';
import { ProfileEntity } from './entities/profile.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { ProfileTransactionService } from './profile-transaction.service';
import { ProfileService } from './profile.service';
import { TransactionService } from './transaction.service';

@Controller('access-control')
@ApiTags('Access Control')
@ApiBearerAuth()
export class AccessControlController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly profileTransactionService: ProfileTransactionService,
        private readonly transactionService: TransactionService
    ) {}

    @Put('profiles')
    @UseGuards(PermissionGuard(Permission.AccessControl.CHANGE_PROFILE))
    async changeProfile(
        @Body() changeProfileArrayDto: ChangeProfileArrayDto
    ): Promise<ProfileTransactionEntity[]> {
        return this.profileTransactionService.changeProfile(changeProfileArrayDto);
    }

    @Get('profiles')
    @UseGuards(PermissionGuard(Permission.AccessControl.READ_PROFILES))
    async getAllProfiles(): Promise<ProfileEntity[]> {
        return this.profileService.getAll();
    }

    @Get('profiles/:profile_id')
    @UseGuards(PermissionGuard(Permission.AccessControl.READ_PROFILES_BY_ID))
    async getProfileById(@Param('profile_id') profile_id: number): Promise<ProfileEntity> {
        return this.profileService.getOne(profile_id);
    }

    @Get('transactions')
    @UseGuards(PermissionGuard(Permission.AccessControl.READ_TRANSACTIONS))
    async getAllTransactions(): Promise<TransactionEntity[]> {
        return this.transactionService.getAll();
    }

    @Patch('transactions/changeStatus/:transaction_id')
    @UseGuards(PermissionGuard(Permission.AccessControl.CHANGE_TRANSACTION_STATUS_BY_ID))
    async changeStatus(@Param('transaction_id') transaction_id: number): Promise<TransactionEntity> {
        return this.transactionService.changeStatus(transaction_id);
    }

}
