import { AllValueToBitTransformer } from "src/config/database/transformers/all-value-to-bit";
import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("CABINET")

export class CabinetEntity {

    @PrimaryGeneratedColumn()
    cabinet_id: number

    @Column()
    cabinet_name: string

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    cabinet_status: boolean

    @Column({
        type: 'bit',
        transformer: new AllValueToBitTransformer(),
    })
    cabinet_side: number;

}


