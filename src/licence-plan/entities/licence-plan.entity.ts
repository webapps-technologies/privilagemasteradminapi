import { Licence } from 'src/licence/entities/licence.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LicencePlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  licenceId: string;

  @Column({ type: 'uuid', nullable: true })
  planId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Licence, (licence) => licence.licencePlan, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  licence: Licence[];

  @ManyToOne(() => Plan, (plan) => plan.licencePlan, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  plan: Plan[];
}
