import { Account } from 'src/account/entities/account.entity';
import { PaymentStatus, PaymentType } from 'src/enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PaymentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  invoiceNumber: string;

  @Column({ type: 'text', nullable: true })
  orderId: string;

  @Column({ type: 'text', nullable: true })
  signature: string;

  @Column({ type: 'text', nullable: true })
  paymentId: string;

  // @Column({ type: 'text', nullable: true })
  // summary: string;

  // @Column({ type: 'double', default: 0 })
  // shippingCharge: number;

  @Column({ type: 'double', default: 0 })
  amount: number;

  // @Column({ type: 'double', default: 0 })
  // wallet: number;

  // @Column({ type: 'int', default: 0 })
  // discount: number;

  @Column({ type: 'float', default: 0 })
  gst: number;

  @Column({ type: 'double', default: 0 })
  total: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.RAZOR_PAY })
  mode: PaymentType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  updatedId: string;

  @ManyToOne(() => Account, (account) => account.paymentHistory, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  account: Account[];

  @BeforeInsert()
  generateNumber() {
    this.invoiceNumber = '#' + Date.now().toString();
  }
}
