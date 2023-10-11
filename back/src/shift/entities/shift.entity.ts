import { BitToBooleanTransformer } from "src/config/database/transformers/bit-to-boolean.transformer";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('SHIFT')
export class ShiftEntity {

    @PrimaryGeneratedColumn()
    shift_id: number

    @Column()
    shift_name: string

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    shift_status: boolean

    @OneToMany(() => User, (user) => user.shift)
    users: User[];
}
