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
  BusinessLoginDto,
  ForgotPassDto,
  OtpDto,
  SigninDto,
  VerifyOtpDto,
} from './dto/login.dto';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { LoginHistory } from 'src/login-history/entities/login-history.entity';
import { Business } from 'src/business/entities/business.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(UserPermission)
    private readonly upRepo: Repository<UserPermission>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
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
    const result = await this.repo
      .createQueryBuilder('account')
      .where('account.email = :email OR account.phoneNumber = :phoneNumber', {
        email: dto.email,
        phoneNumber: dto.phoneNumber,
      })
      .getOne();
    if (result) {
      throw new ConflictException('Email or Phone Number already exists!');
    }
    const obj = Object.assign({
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      password: await bcrypt.hash(dto.password, 10),
      roles: UserRole.BUSINESS,
    });
    const account = await this.repo.save(obj);

    const busiObj = Object.assign({
      personEmail: dto.email,
      personPhone: dto.phoneNumber,
      accountId: account.id,
    });
    await this.businessRepo.save(busiObj);

    return account;
  }

  async businessLogin(dto: BusinessLoginDto) {
    const result = await this.repo
      .createQueryBuilder('account')
      .where(
        'account.email = :email AND account.roles = :roles AND account.status = :status',
        {
          email: dto.email,
          roles: UserRole.BUSINESS,
          status: DefaultStatus.ACTIVE,
        },
      )
      .getOne();
    if (!result) {
      throw new NotFoundException('EmailId not found! Please contact admin.');
    }
    const comparePassword = await bcrypt.compare(dto.password, result.password);
    if (!comparePassword) {
      throw new UnauthorizedException('password mismatched!!');
    }
    const token = await APIFeatures.assignJwtToken(result.id, this.jwtService);

    return { token, business: { id: result.id, email: result.email } };
  }

  async memberLogin(dto: SigninDto) {
    let user = await this.repo.findOne({
      where: { phoneNumber: dto.loginId, roles: UserRole.USER },
    });
    if (!user) {
      const obj = Object.create({
        phoneNumber: dto.loginId,
        type: LoginType.PHONE,
        roles: UserRole.USER,
        // fcm,
      });
      user = await this.repo.save(obj);
      const udObj = Object.create({
        accountId: user.id,
      });
      await this.userDetailRepo.save(udObj);
    }
    // const fcmObj = Object.assign(user,{fcm: fcm});
    // await this.repo.save(fcmObj);

    const otp = 783200;
    // const otp = Math.floor(100000 + Math.random() * 9000);
    // sendOtp(+loginId, otp);
    this.cacheManager.set(dto.loginId, otp, 10 * 60 * 1000);
    return { loginId: dto.loginId };
  }

  async memberVerifyOtp(dto: OtpDto) {
    const user = await this.getUserDetails(dto.loginId, UserRole.USER);
    const sentOtp = await this.cacheManager.get(dto.loginId);

    // if (phoneNumber != '8092326469') {
    if (dto.otp != sentOtp) {
      throw new UnauthorizedException('Invalid otp!');
    }
    // }
    const token = await APIFeatures.assignJwtToken(user.id, this.jwtService);

    const userName = user.userDetail[0].fName;
    if (userName == null) {
      return {
        token,
        latest: true,
        status: user.userDetail[0].status,
      };
    } else {
      return {
        token,
        latest: false,
        status: user.userDetail[0].status,
      };
    }
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
      .leftJoinAndSelect('account.business', 'business')
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
