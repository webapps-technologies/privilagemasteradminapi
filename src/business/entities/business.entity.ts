import { Account } from 'src/account/entities/account.entity';
import { BusinessStatus, Gender, YNStatus } from 'src/enum';
import { Licence } from 'src/licence/entities/licence.entity';
import { Plan } from 'src/plan/entities/plan.entity';
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
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  personName: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ type: 'varchar', length: 200, nullable: true })
  personEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  personPhone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessKey: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessType: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  businessName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gstNo: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  address1: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  address2: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  zipCode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  signatory: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  renewalDate: Date;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column({ type: 'text', nullable: true })
  logoPath: string;

  @Column({ type: 'text', nullable: true })
  brandLogo: string;

  @Column({ type: 'text', nullable: true })
  brandLogoPath: string;

  @Column({ type: 'text', nullable: true })
  doc1: string;

  @Column({ type: 'text', nullable: true })
  doc1Path: string;

  @Column({ type: 'text', nullable: true })
  doc2: string;

  @Column({ type: 'text', nullable: true })
  doc2Path: string;

  @Column({ type: 'text', nullable: true })
  gstCertificate: string;

  @Column({ type: 'text', nullable: true })
  gstCertificatePath: string;

  @Column({ type: 'text', nullable: true })
  workOrder: string;

  @Column({ type: 'text', nullable: true })
  workOrderPath: string;

  @Column({ type: 'enum', enum: YNStatus, default: YNStatus.NO })
  amc: YNStatus;

  @Column({
    type: 'enum',
    enum: BusinessStatus,
    default: BusinessStatus.DEACTIVE,
  })
  status: BusinessStatus;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.business, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @OneToMany(() => Plan, (plan) => plan.business)
  plan: Plan[];

  @OneToMany(() => Licence, (licence) => licence.business)
  licence: Licence[];
}
