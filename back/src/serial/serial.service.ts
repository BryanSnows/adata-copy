import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSerialDto } from './dto/create-serial.dto';
import { SerialEntity } from './entities/serial.entity';

@Injectable()
export class SerialService {
    constructor(
        @InjectRepository(SerialEntity)
        private readonly serialRepository: Repository<SerialEntity>
    ) {}

    async create(createSerialDto: CreateSerialDto[]) {
        return this.serialRepository.save(createSerialDto);
    }

    async getByNumber(serial_number: string) {
        return this.serialRepository.createQueryBuilder('serial')
        .where('serial.serial_number = :serial_number', { serial_number: serial_number })
        .getOne();
    }

 }
