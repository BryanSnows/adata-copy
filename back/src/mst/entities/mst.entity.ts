import { AllValueToBitTransformer } from "src/config/database/transformers/all-value-to-bit";
import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('MST')
export class MstEntity {

  @PrimaryGeneratedColumn()
  mst_id: number;

  @Column()
  mst_name: string;

  @Column()
  mst_ip: string;

  @Column({
    type: 'bit',
    transformer: new AllValueToBitTransformer(),
  })
  mst_side: number;

  @Column({
    type: 'bit',
    transformer: new BitToBooleanTransformer(),
  })
  mst_status: boolean;
  
}
