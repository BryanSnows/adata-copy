import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('SITUATION')
export class SituationEntity {

    @PrimaryGeneratedColumn()
    situation_id: number;

    @Column()
    situation_name: number;
}