import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity({name:"messagetest"})
export class MessageTest{
    @PrimaryGeneratedColumn()
    idmessage: number;

    @Column({default: 1})
    idutilisateurenvoie: number;

    @Column({default: 1})
    idutilisateurecoie: number;

    @Column({default: "a"})
    message: string;

}
