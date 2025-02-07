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
export class CardAmenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  membershipCardId: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => MembershipCard,
    (membershipCard) => membershipCard.cardAmenities,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  membershipCard: MembershipCard[];
}
