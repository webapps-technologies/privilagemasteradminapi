import { Business } from 'src/business/entities/business.entity';
import { DefaultStatus, PlanType } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  packageName: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  benefits: string;

  @Column({ type: 'int', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  mrp: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  membership: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) // In Days
  duration: string;

  @Column({ type: 'int', default: 0 })
  amcPrice: number;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  termsAndCond: string;

  @Column({ type: 'enum', enum: PlanType, default: PlanType.PUBLIC })
  type: PlanType;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({ type: 'uuid', nullable: true })
  businessId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Business, (business) => business.plan, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  business: Business[];
}
