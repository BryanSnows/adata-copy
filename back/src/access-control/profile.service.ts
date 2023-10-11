import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/access-control/entities/profile.entity';
import { Repository } from 'typeorm';
import { TransactionService } from './transaction.service';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly profileRepository: Repository<ProfileEntity>,
        private readonly transactionService: TransactionService
    ) {}

    async getAll(): Promise<ProfileEntity[]> {
        const profiles = await this.profileRepository.createQueryBuilder('profile')
        .leftJoinAndSelect('profile.transactions', 'transactions')
        .getMany();

        return Promise.all(
            profiles.map(async (profile: ProfileEntity) => {
                if (profile.profile_id === 1) {
                    return this.putAllTransactionsOnProfile(profile);
                }
                return profile;
            })
        )
    }

    async getOne(profile_id: number): Promise<ProfileEntity> {
        let profile = await this.profileRepository.createQueryBuilder('profile')
        .leftJoinAndSelect('profile.transactions', 'transactions')
        .where('profile.profile_id = :profile_id', { profile_id: profile_id })
        .getOne();

        if (profile.profile_id === 1) {
            return this.putAllTransactionsOnProfile(profile);
        }

        return profile;
    }

    async verifyRegisteredProfiles(profile_ids: number[]) {
        const profiles = await this.getAll();
        const registered_ids = profiles.map((profile) => profile.profile_id);

        profile_ids?.forEach((profile_id: number) => {
            if (!registered_ids.includes(profile_id)) {
                throw new UnauthorizedException(`Perfil com id ${profile_id} não registrado!`);
            }
        });
    }

    async putAllTransactionsOnProfile(profile: ProfileEntity): Promise<ProfileEntity> {
        const transactions = await this.transactionService.getAll();
        return {...profile, transactions: transactions };
    }
}
