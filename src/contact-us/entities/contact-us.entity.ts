import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ContactUs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lName: string;
  
  @Column({ type: 'text', nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  query: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
