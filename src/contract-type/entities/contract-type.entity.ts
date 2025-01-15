import { DefaultStatus } from "src/enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ContractType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 100, nullable: true})
    name: string;

    @Column({type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING})
    status: DefaultStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
