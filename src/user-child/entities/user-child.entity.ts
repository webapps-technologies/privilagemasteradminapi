import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserChild {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userDetailId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  relation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  martialStatus: string;

  @Column({ type: 'text', nullable: true })
  profile: string;

  @Column({ type: 'text', nullable: true })
  profilePath: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserDetail, (userDetail) => userDetail.userChild, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userDetail: UserDetail[];
}
