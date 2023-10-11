import { ShiftEntity } from "src/shift/entities/shift.entity";
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ProfileEntity } from "../../access-control/entities/profile.entity";
import { OfficeEntity } from "../../office/entities/office.entity";
import { BitToBooleanTransformer } from '../../config/database/transformers/bit-to-boolean.transformer';


@Entity('USER')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    user_email: string;

    @Column()
    user_password: string;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    user_status: boolean;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    user_first_access: boolean;

    @Column()
    user_refresh_token: string;

    @Column()
    user_profile_id: number;

    @Column()
    user_enrollment: string;

    @Column()
    office_id: number;

    @Column()
    user_shift_id: number;

    @Column({
        type: 'bit',
        transformer: new BitToBooleanTransformer(),
    })
    user_password_status: boolean;

    @Column()
    user_mes_id: number;

    @ManyToOne(() => ProfileEntity, (profile) => profile.users)
    @JoinColumn({ name: 'user_profile_id' })
    profile: ProfileEntity

    @ManyToOne(() => ShiftEntity, (shift) => shift.users)
    @JoinColumn({ name: 'user_shift_id' })
    shift: ShiftEntity

    @ManyToOne(() => OfficeEntity, (office) => office.users)
    @JoinColumn({name: 'office_id'})
    office: OfficeEntity
}
