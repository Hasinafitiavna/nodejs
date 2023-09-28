import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Utilisateur{
    @PrimaryGeneratedColumn()
    idutilisateur: number;

    @Column({default: "a"})
    nom: string;

    @Column({default: "a"})
    prenom: string;

    @Column({default: "a"})
    email: string;

    @Column({default: "a"})
    password: string;
}
