import { Account } from 'src/account/entities/account.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  user_domain: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  admin_domain: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  mobile_domain: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dateFormat: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  timeFormat: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  timeZone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  defaultLanguage: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.setting, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];
}
