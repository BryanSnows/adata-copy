import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { WorkOrderSerialEntity } from "src/travel-card/entities/workorder-serial.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('SERIAL_EXCEPTION')
export class SerialExceptionEntity {

    @PrimaryGeneratedColumn()
    serial_exception_id: number;

    @Column()
    workorder_serial_id: number;

    @Column()
    serial_exception_created_at: Date;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    serial_exception_resent: boolean;

    @OneToOne(() => WorkOrderSerialEntity)
    @JoinColumn({ name: 'workorder_serial_id' })
    workorder_serial?: WorkOrderSerialEntity
}