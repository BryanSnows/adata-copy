import { SerialEntity } from "src/serial/entities/serial.entity";
import { WorkOrderEntity } from "src/work-order/entities/work-order.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('WORKORDER_SERIAL')
export class WorkOrderSerialEntity {

    @PrimaryGeneratedColumn()
    workorder_serial_id?: number;

    @Column()
    work_order_id: number;

    @Column()
    serial_id: number;

    @OneToOne(() => WorkOrderEntity)
    @JoinColumn({ name: 'work_order_id' })
    work_order?: WorkOrderEntity

    @OneToOne(() => SerialEntity)
    @JoinColumn({ name: 'serial_id' })
    serial?: SerialEntity
}