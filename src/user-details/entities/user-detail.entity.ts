import { Account } from 'src/account/entities/account.entity';
import { Gender, LanguageLevel } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 55, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  workStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mobileNumber: string;
  
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  area: string;
  
  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dob: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  currLocation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  hometown: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  totalExpYear: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  totalExpMonth: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  currSalary: string;

  @Column({ type: 'text', nullable: true })
  profile: string;

  @Column({ type: 'text', nullable: true })
  profileName: string;

  @Column({ type: 'text', nullable: true })
  resume: string;

  @Column({ type: 'text', nullable: true })
  resumePath: string;

  @Column({ type: 'enum', enum: LanguageLevel, default: LanguageLevel.NONE })
  englishLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.userDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];
}
