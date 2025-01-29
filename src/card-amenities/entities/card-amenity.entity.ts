import { Amenity } from 'src/amenities/entities/amenity.entity';
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

  @Column({ type: 'uuid', nullable: true })
  amenitiesId: string;

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

  @ManyToOne(() => Amenity, (amenities) => amenities.cardAmenities, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  amenities: Amenity[];
}
