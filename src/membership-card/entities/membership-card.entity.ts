import { Account } from 'src/account/entities/account.entity';
import { CardAmenity } from 'src/card-amenities/entities/card-amenity.entity';
import { CardGallery } from 'src/card-gallery/entities/card-gallery.entity';
import { CardTnc } from 'src/card-tnc/entities/card-tnc.entity';
import { DefaultStatus } from 'src/enum';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
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
export class MembershipCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  validity: string; //In Days

  @Column({ type: 'float', default: 0 })
  price: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  currencyType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cardType: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  desc: string;

  @Column({ type: 'int', default: 0 })
  memberCount: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessName: string;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.PENDING })
  status: DefaultStatus;

  @Column({type: 'text', nullable: true})
  cardDesign: string;

  @Column({type: 'text', nullable: true})
  cardDesignPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.membershipCard, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @OneToMany(() => CardTnc, (cardTnc) => cardTnc.membershipCard)
  cardTnc: CardTnc[];

  @OneToMany(() => CardGallery, (cardGallery) => cardGallery.membershipCard)
  cardGallery: CardGallery[];

  @OneToMany(() => CardAmenity, (cardAmenities) => cardAmenities.membershipCard)
  cardAmenities: CardAmenity[];

  @OneToMany(() => UserDetail, (userDetail) => userDetail.membershipCard)
  userDetail: UserDetail[];
}
