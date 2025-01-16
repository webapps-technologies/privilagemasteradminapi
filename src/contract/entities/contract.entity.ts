import { BusinessContract } from 'src/business-contract/entities/business-contract.entity';
import { ContractType } from 'src/contract-type/entities/contract-type.entity';
import { DefaultStatus } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  contractName: string;

  @Column({ type: 'uuid', nullable: true })
  contractTypeId: string;

  @Column({ type: 'date', nullable: true })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validTill: Date;

  @Column({ type: 'varchar', length: 15000, nullable: true })
  desc: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ContractType, (contractType) => contractType.contract, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  contractType: ContractType[];

  @OneToMany(
    () => BusinessContract,
    (businessContract) => businessContract.contract,
  )
  businessContract: BusinessContract[];
}
