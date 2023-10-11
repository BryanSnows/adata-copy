import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('WORK_ORDER')
export class WorkOrderEntity {

    @PrimaryGeneratedColumn()
    work_order_id: number;

    @Column({ unique: true })
    work_order_number: number;

    @Column()
    model_name: string;

    @Column()
    customer: string;

    @Column()
    rdt_time: string;

    @Column()
    fw: string;

    @Column()
    pn3: number;

}