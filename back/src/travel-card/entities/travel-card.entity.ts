import { CabinetEntity } from "src/cabinet/entities/cabinet.entity";
import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { MstEntity } from "src/mst/entities/mst.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SituationEntity } from "./situation.entity";
import { WorkOrderSerialEntity } from "./workorder-serial.entity";

@Entity('TRAVEL_CARD')
export class TravelCardEntity {

    @PrimaryGeneratedColumn()
    travel_card_id: number;

    @Column()
    workorder_serial_id: number;

    @Column()
    position: number;

    @Column()
    mst_id: number;

    @Column()
    cabinet_id: number;

    @Column()
    situation_id: number;

    @Column()
    test_serial_count: number;

    @Column({
        type: 'bit',
        nullable: true,
        transformer: new BitToBooleanTransformer(),
    })
    status: boolean;

    @OneToOne(() => WorkOrderSerialEntity)
    @JoinColumn({ name: 'workorder_serial_id' })
    workorder_serial: WorkOrderSerialEntity

    @OneToOne(() => CabinetEntity)
    @JoinColumn({ name: 'cabinet_id' })
    cabinet: CabinetEntity

    @OneToOne(() => MstEntity)
    @JoinColumn({ name: 'mst_id' })
    mst: MstEntity

    @OneToOne(() => SituationEntity)
    @JoinColumn({ name: 'situation_id' })
    situation: SituationEntity;

    @Column({
        type: 'timestamp'
    })
    created_at: Date;

}