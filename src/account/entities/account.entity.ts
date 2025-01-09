import { AdminDetail } from 'src/admin-detail/entities/admin-detail.entity';
import { Business } from 'src/business/entities/business.entity';
import { CompanyDetail } from 'src/company-details/entities/company-detail.entity';
import {
  AIType,
  DefaultStatus,
  LoginType,
  UserRole,
} from 'src/enum';
import { LoginHistory } from 'src/login-history/entities/login-history.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  deviceId: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  roles: UserRole;

  @Column({ type: 'enum', enum: LoginType, default: LoginType.PHONE })
  type: LoginType;

  @Column({ type: 'enum', enum: DefaultStatus, default: DefaultStatus.ACTIVE })
  status: DefaultStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AdminDetail, (adminDetail) => adminDetail.account)
  adminDetail: AdminDetail[];

  @OneToMany(() => LoginHistory, (loginHistory) => loginHistory.account)
  loginHistory: LoginHistory[];

  @OneToMany(() => Business, (business) => business.account)
  business: Business[];

  @OneToMany(() => Notification, (notification) => notification.account)
  notification: Notification[];

  @OneToMany(() => UserPermission, (userPermission) => userPermission.account)
  userPermission: UserPermission[];

  @OneToMany(() => UserDetail, (userDetail) => userDetail.account)
  userDetail: UserDetail[];

  @OneToMany(() => CompanyDetail, (companyDetail) => companyDetail.account)
  companyDetail: CompanyDetail[];

  @OneToMany(() => StaffDetail, (staffDetail) => staffDetail.account)
  staffDetail: StaffDetail[];
}
