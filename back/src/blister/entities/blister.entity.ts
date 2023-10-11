import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('BLISTER')
export class BlisterEntity {

    @PrimaryGeneratedColumn()
    blister_id: number

    @Column()
    blister_name: string

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    blister_status: boolean
   
    @Column()
    blister_qtd: string

    @Column()
    blister_img: string

}
