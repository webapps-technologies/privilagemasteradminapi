import { Business } from 'src/business/entities/business.entity';
import { DefaultStatus } from 'src/enum';
import { LicencePlan } from 'src/licence-plan/entities/licence-plan.entity';
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
export class Licence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  businessId: string;

  @Column({ type: 'int', default: 0 })
  userLimit: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  licenceKey: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  activationKey: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  renewalDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @ManyToOne(() => Business, (business) => business.licence, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  business: Business[];

  @OneToMany(() => LicencePlan, (licencePlan) => licencePlan.licence)
  licencePlan: LicencePlan[];
}
