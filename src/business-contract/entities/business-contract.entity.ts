import { Account } from 'src/account/entities/account.entity';
import { Business } from 'src/business/entities/business.entity';
import { Contract } from 'src/contract/entities/contract.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BusinessContract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  contractId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.businessContract, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(() => Contract, (contract) => contract.businessContract, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  contract: Contract[];
}
