import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('SERIAL')
export class SerialEntity {

    @PrimaryGeneratedColumn()
    serial_id: number;

    @Column()
    serial_number: string;
}