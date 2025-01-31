import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultStatus, UserRole } from 'src/enum';
import { Brackets, Repository } from 'typeorm';
import {
  AddMemberDto,
  CreateAccountDto,
  EmailUpdateDto,
  UpdateStaffDto,
  UpdateStaffPasswordDto,
} from './dto/account.dto';
import { Account } from './entities/account.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import * as bcrypt from 'bcrypt';
import { StaffDetail } from 'src/staff-details/entities/staff-detail.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import { Menu } from 'src/menus/entities/menu.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(UserDetail)
    private readonly udRepo: Repository<UserDetail>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(StaffDetail)
    private readonly staffRepo: Repository<StaffDetail>,
    @InjectRepository(Menu)
    private readonly menuRepo: Repository<Menu>,
  ) {}

  async create(dto: CreateAccountDto, createdBy: string) {
    const user = await this.repo.findOne({
      where: { phoneNumber: dto.loginId, roles: UserRole.STAFF },
    });
    if (user) {
      throw new ConflictException('Login id already exists!');
    }

    const encryptedPassword = await bcrypt.hash(dto.password, 13);
    const obj = Object.assign({
      phoneNumber: dto.loginId,
      password: encryptedPassword,
      createdBy,
      roles: UserRole.STAFF,
    });
    const payload = await this.repo.save(obj);
    const object = Object.assign({
      name: dto.name,
      email: dto.email,
      dob: dto.dob,
      accountId: payload.id,
    });
    await this.staffRepo.save(object);
    return payload;
  }

  async addMember(dto: AddMemberDto) {
    const result = await this.repo.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (result) {
      throw new ConflictException('Phone number already exists!');
    }
    const accObj = Object.create({
      phoneNumber: dto.phoneNumber,
      roles: UserRole.USER,
    });
    const account = await this.repo.save(accObj);
    const udObj = Object.create({
      accountId: account.id,
      email: dto.email,
      fName: dto.fName,
      mName: dto.mName,
      lName: dto.lName,
      gender: dto.gender,
      address1: dto.address1,
      address2: dto.address2,
      city: dto.city,
      state: dto.state,
      zipcode: dto.zipcode,
      businessType: dto.businessType,
      businessName: dto.businessName,
      gstNumber: dto.gstNumber,
      businessCity: dto.businessCity,
      businessState: dto.businessState,
      businessZipcode: dto.businessZipcode,
      businessPhone: dto.businessPhone,
      membershipCardId: dto.membershipCardId,
    });
    await this.udRepo.save(udObj);
    return account;
  }

  async adminProfile(accountId: string) {
    const result = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.adminDetail', 'adminDetail')
      .select([
        'account.id',
        'account.email',
        'account.password',
        'account.roles',
        'account.status',
        'account.createdAt',

        'adminDetail.id',
        'adminDetail.accountId',
        'adminDetail.userName',
        'adminDetail.phoneNumber',
        'adminDetail.profileImage',
      ])
      .where('account.id = :id AND account.roles = :roles', {
        id: accountId,
        roles: UserRole.ADMIN,
      })
      .getOne();
    return result;
  }

  async getStaffDetails(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const query = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.staffDetail', 'staffDetail')
      .select([
        'account.id',
        'account.phoneNumber',
        'account.password',
        'account.roles',
        'account.status',
        'account.createdAt',

        'staffDetail.id',
        'staffDetail.name',
        'staffDetail.email',
        'staffDetail.dob',
        'staffDetail.createdAt',
      ])
      .where('account.roles = :roles AND account.status = :status', {
        roles: UserRole.STAFF,
        status: dto.status,
      });

    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'account.phoneNumber LIKE :keyword OR staffDetail.name LIKE :keyword OR staffDetail.email LIKE :keyword',
            {
              keyword: '%' + keyword + '%',
            },
          );
        }),
      )
      .orderBy({ 'staffDetail.name': 'ASC' })
      .skip(dto.offset)
      .take(dto.limit)
      .getManyAndCount();

    return { result, total };
  }

  async getStaffProfile(accountId: string) {
    let perms = await this.cacheManager.get('staffDetailPerms' + accountId);
    if (!perms) {
      perms = await this.menuRepo
        .createQueryBuilder('menu')
        .leftJoinAndSelect('menu.userPermission', 'userPermission')
        .leftJoinAndSelect('userPermission.permission', 'permission')
        .where('userPermission.accountId = :accountId', {
          accountId: accountId,
        })
        .orderBy({ 'menu.title': 'ASC', 'permission.id': 'ASC' })
        .getMany();
      this.cacheManager.set(
        'staffDetailPerms' + accountId,
        perms,
        6 * 60 * 60 * 1000,
      );
    }
    return { perms };
  }

  async userProfile(accountId: string) {
    const result = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect('userDetail.membershipCard', 'membershipCard')
      .select([
        'account.id',
        'account.phoneNumber',
        'account.roles',
        'account.status',
        'account.createdAt',

        'userDetail.id',
        'userDetail.fName',
        'userDetail.mName',
        'userDetail.lName',
        'userDetail.email',
        'userDetail.gender',
        'userDetail.profile',
        'userDetail.address1',
        'userDetail.address2',
        'userDetail.city',
        'userDetail.state',
        'userDetail.zipcode',
        'userDetail.memberDoc',
        'userDetail.businessType',
        'userDetail.businessName',
        'userDetail.gstNumber',
        'userDetail.businessDoc',
        'userDetail.businessCity',
        'userDetail.businessState',
        'userDetail.businessZipcode',
        'userDetail.businessPhone',
        'userDetail.status',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validYear',
        'membershipCard.validMonth',
      ])
      .where('account.id = :id', { id: accountId })
      .getOne();
    return result;
  }

  async resetEmail(dto: EmailUpdateDto, accountId: string) {
    const storedOtp = await this.cacheManager.get<string>(dto.email);
    if (storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    const result = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .select([
        'account.id',
        'account.email',
        'account.roles',
        'account.status',

        'userDetail.id',
        'userDetail.email',
      ])
      .where(
        'account.id = :id AND account.roles = :roles AND account.status = :status',
        {
          id: accountId,
          roles: UserRole.USER,
          status: DefaultStatus.ACTIVE,
        },
      )
      .getOne();
    const obj = Object.assign(result, { email: dto.email });
    const account = await this.repo.save(obj);

    result.userDetail[0].email = dto.email;
    this.udRepo.save(result.userDetail[0]);
    return account;
  }

  async recruiterStatus(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async updateStaff(accountId: string, dto: UpdateStaffDto) {
    const result = await this.staffRepo.findOne({ where: { accountId } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    const obj = Object.assign(result, dto);
    return this.staffRepo.save(obj);
  }

  async updateStaffPassword(accountId: string, dto: UpdateStaffPasswordDto) {
    const result = await this.repo.findOne({ where: { id: accountId } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    if (dto.loginId && dto.loginId.length > 0) {
      const obj = Object.assign(result, { phoneNumber: dto.loginId });
      await this.repo.save(obj);
    }
    if (dto.password && dto.password.length > 0) {
      const password = await bcrypt.hash(dto.password, 10);
      const obj = Object.assign(result, { password: password });
      await this.repo.save(obj);
    }
    return result;
  }

  async staffStatus(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
