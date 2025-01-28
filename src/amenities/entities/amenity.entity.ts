import { Account } from 'src/account/entities/account.entity';
import { DefaultStatus } from 'src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Amenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  iconPath: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  shortDesc: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  desc: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.amenities, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  account: Account[];
}
