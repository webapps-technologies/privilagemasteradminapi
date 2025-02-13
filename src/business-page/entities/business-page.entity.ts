import { Account } from 'src/account/entities/account.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BusinessPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  desc: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.businessPage, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  account: Account[];
}
