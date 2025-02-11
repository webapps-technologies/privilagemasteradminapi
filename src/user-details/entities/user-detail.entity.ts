import { Account } from 'src/account/entities/account.entity';
import { DefaultStatus, Gender } from 'src/enum';
import { MembershipCard } from 'src/membership-card/entities/membership-card.entity';
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

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lName: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address1: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address2: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  landMark: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fatherName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dob: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  qualification: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profession: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  panNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  income: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  zipcode: string;

  @Column({ type: 'text', nullable: true })
  profile: string;

  @Column({ type: 'text', nullable: true })
  profilePath: string;

  @Column({ type: 'text', nullable: true })
  memberDoc: string;

  @Column({ type: 'text', nullable: true })
  memberDocPath: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  gstNumber: string;

  @Column({ type: 'text', nullable: true })
  businessDoc: string;

  @Column({ type: 'text', nullable: true })
  businessDocPath: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessCity: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessState: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessZipcode: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessPhone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessLandmark: string;

  @Column({ type: 'date', nullable: true })
  membershipValidFrom: Date;

  @Column({ type: 'date', nullable: true })
  membershipValidTo: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  memberId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cardNumber: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  membershipCardId: string;

  @ManyToOne(() => Account, (account) => account.userDetail, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @ManyToOne(
    () => MembershipCard,
    (membershipCard) => membershipCard.userDetail,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  membershipCard: MembershipCard[];
}
