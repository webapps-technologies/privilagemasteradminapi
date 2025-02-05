import { Account } from 'src/account/entities/account.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OtherMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  clubName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  duration: string;

  @ManyToOne(() => Account, (account) => account.otherMembership, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];
}
