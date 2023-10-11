import { CabinetEntity } from "src/cabinet/entities/cabinet.entity";
import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('SLOT_DEFECT')
export class SlotDefectEntity {

    @PrimaryGeneratedColumn()
    slot_defect_id: number;

    @Column()
    cabinet_id: number;

    @Column()
    position: number;

    @Column()
    count: number;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    status?: boolean;

    @Column()
    user_name: string;

    @Column()
    created_at?: Date;

    @OneToOne(() => CabinetEntity)
    @JoinColumn({ name: 'cabinet_id' })
    cabinet?: CabinetEntity;
}