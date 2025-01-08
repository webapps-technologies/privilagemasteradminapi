import { Account } from 'src/account/entities/account.entity';
import { CompanyType, DefaultStatus } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CompanyDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 55, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  companyName: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  shortDesc: string;

  @Column({ type: 'enum', enum: CompanyType, default: CompanyType.PVT })
  companyType: CompanyType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  designation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  companyEmail: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  companyURL: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  companySize: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gstNumber: string;

  @Column({ type: 'text', nullable: true })
  profile: string;

  @Column({ type: 'text', nullable: true })
  profileName: string;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column({ type: 'text', nullable: true })
  logoPath: string;

  @Column({ type: 'text', nullable: true })
  doc: string;

  @Column({ type: 'text', nullable: true })
  docPath: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  docStatus: DefaultStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  rating: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  reviews: string;

  @Column({ type: 'int', default: 0 })
  jobCount: number;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.companyDetail, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  account: Account[];
}
