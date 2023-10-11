
import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('SN_LIST_HISTORY')
export class SnList {
    @PrimaryGeneratedColumn()
    sn_list_history_id: number

    @Column()
    work_order_number: number;

    @Column()
    serial_number: string;

    @Column()
    model_name: string;

    @Column()
    customer: string;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer()
    })
    status: boolean;

    @Column()
    mst_name: string;

    @Column()
    cabinet_name: string;

    @Column()
    position: number;

    @Column({
        type: 'timestamp'
    })
    created_at: Date;
}
