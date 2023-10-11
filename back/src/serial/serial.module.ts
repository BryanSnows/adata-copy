import { SerialService } from './serial.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SerialEntity } from './entities/serial.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SerialEntity])],
    controllers: [],
    providers: [
        SerialService
    ],
    exports: [
        SerialService
    ]
})
export class SerialModule { }
