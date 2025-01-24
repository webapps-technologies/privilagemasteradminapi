import { Account } from 'src/account/entities/account.entity';
import { DefaultStatus } from 'src/enum';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tax {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  taxName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rate: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.tax, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];
}
