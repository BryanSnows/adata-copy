import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";


@Entity('OFFICE')
export class OfficeEntity {

    @PrimaryGeneratedColumn()
    office_id: number

    @Column()
    oficce_name: string

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    office_status: boolean

    @OneToMany(() => User, (user) => user.office)
    users: User[];

}