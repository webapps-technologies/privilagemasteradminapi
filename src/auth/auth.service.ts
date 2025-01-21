import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { Account } from 'src/account/entities/account.entity';
import { CompanyDetail } from 'src/company-details/entities/company-detail.entity';
import { DefaultStatus, LogType, LoginType, UserRole } from 'src/enum';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';
import APIFeatures from 'src/utils/apiFeatures.utils';
import { Repository } from 'typeorm';
import {
  AdminSigninDto,
  BusinessCreateDto,
  ForgotPassDto,
  VerifyOtpDto,
} from './dto/login.dto';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { LoginHistory } from 'src/login-history/entities/login-history.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(UserPermission)
    private readonly upRepo: Repository<UserPermission>,
    @InjectRepository(CompanyDetail)
    private readonly companyDetailRepo: Repository<CompanyDetail>,
    @InjectRepository(UserDetail)
    private readonly userDetailRepo: Repository<UserDetail>,
    @InjectRepository(LoginHistory)
    private readonly logRepo: Repository<LoginHistory>,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly nodeMailerService: NodeMailerService,
  ) {}

  async adminLogin(dto: AdminSigninDto) {
    const admin = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.adminDetail', 'adminDetail')
      .where('account.email = :email AND account.roles = :roles', {
        email: dto.email,
        roles: UserRole.ADMIN,
      })
      .getOne();
    if (!admin) {
      throw new NotFoundException('EmailId not found! Please contact admin.');
    }
    const comparePassword = await bcrypt.compare(dto.password, admin.password);
    if (!comparePassword) {
      throw new UnauthorizedException('password mismatched!!');
    }
    const otp = 783200;
    // const otp = Math.floor(100000 + Math.random() * 9000);
    // this.nodeMailerService.sendOtpInEmail(dto.email, otp);
    this.cacheManager.set(dto.email, otp, 10 * 60 * 1000);

    return 'OTP Sent in email!';
  }

  async verifyOtp(dto: VerifyOtpDto, ip: string) {
    const admin = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.adminDetail', 'adminDetail')
      .where('account.email = :email AND account.roles = :roles', {
        email: dto.email,
        roles: UserRole.ADMIN,
      })
      .getOne();
    if (!admin) {
      throw new NotFoundException('Admin account not found');
    }
    const storedOtp = await this.cacheManager.get<string>(dto.email);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    const token = await APIFeatures.assignJwtToken(admin.id, this.jwtService);

    const obj = Object.create({
      loginId: admin.email,
      ip: ip,
      type: LogType.LOGIN,
      accountId: admin.id,
    });
    await this.logRepo.save(obj);

    return { token, admin: { id: admin.id, email: admin.email } };
  }

  async createBusiness(dto: BusinessCreateDto) {
    const result = await this.repo.find({
      where: { email: dto.email, phoneNumber: dto.phoneNumber },
    });
    if (result) {
      throw new ConflictException('Email or Phone Number already exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async logout(accountId: string, ip: string) {
    const admin = await this.repo
      .createQueryBuilder('account')
      .where('account.id = :id', { id: accountId })
      .getOne();

    const latestLogin = await this.logRepo
      .createQueryBuilder('loginHistory')
      .where(
        'loginHistory.accountId = :accountId AND loginHistory.type = :type',
        {
          accountId: accountId,
          type: LogType.LOGIN,
        },
      )
      .orderBy('loginHistory.createdAt', 'DESC')
      .getOne();
    if (latestLogin) {
      const now = new Date();
      var duration = Math.floor(
        (now.getTime() - new Date(latestLogin.createdAt).getTime()) / 1000,
      ); // in seconds
      // latestLogin.duration = duration;
      // await this.logRepo.save(latestLogin);
    }

    const obj = Object.create({
      loginId: admin.email,
      ip: ip,
      type: LogType.LOGOUT,
      duration: duration,
      accountId: accountId,
    });
    return this.logRepo.save(obj);
  }

  async resetPassword(dto: ForgotPassDto) {
    const user = await this.repo
      .createQueryBuilder('account')
      .where('account.email = :email AND account.roles = :roles', {
        email: dto.email,
        roles: UserRole.ADMIN,
      })
      .getOne();
    if (!user) {
      throw new NotFoundException('Email does not exist!');
    }
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;

    await this.repo.save(user);

    return { message: 'Password reset successfully' };
  }

  validate(id: string) {
    return this.getUserDetails(id);
  }

  findPermission(accountId: string) {
    return this.getPermissions(accountId);
  }

  private getPermissions = async (accountId: string): Promise<any> => {
    let result = await this.cacheManager.get('userPermission' + accountId);
    if (!result) {
      result = await this.upRepo.find({
        relations: ['permission', 'menu'],
        where: { accountId, status: true },
      });
      this.cacheManager.set(
        'userPermission' + accountId,
        result,
        7 * 24 * 60 * 60 * 1000,
      );
    }
    return result;
  };

  private getUserDetails = async (
    id: string,
    role?: UserRole,
  ): Promise<any> => {
    const query = this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.companyDetail', 'companyDetail')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect('account.staffDetail', 'staffDetail');
    if (!role && role == UserRole.USER) {
      query.where('account.roles = :roles', { roles: UserRole.USER });
    }
    if (!role && role == UserRole.BUSINESS) {
      query.where('account.roles IN (:...roles)', {
        roles: [UserRole.BUSINESS],
      });
    }
    if (!role && role == UserRole.ADMIN) {
      query.where('account.roles IN (:...roles)', {
        roles: [UserRole.ADMIN, UserRole.STAFF],
      });
    }
    const result = await query
      .andWhere('account.id = :id OR account.phoneNumber = :phoneNumber', {
        id: id,
        phoneNumber: id,
      })
      .getOne();
    if (!result) {
      throw new UnauthorizedException('Account not found!');
    }
    return result;
  };
}
