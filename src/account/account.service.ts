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
  MemberPaginationDto,
  PaginationChildDto,
  SearchMemberPaginationDto,
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
import { MembershipCard } from 'src/membership-card/entities/membership-card.entity';
import { generateQrCode } from 'src/utils/qrCode.util';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly repo: Repository<Account>,
    @InjectRepository(UserDetail)
    private readonly udRepo: Repository<UserDetail>,
    @InjectRepository(MembershipCard)
    private readonly memCardRepo: Repository<MembershipCard>,
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
    const membershipCard = await this.memCardRepo.findOne({
      where: { id: dto.membershipCardId },
    });
    if (!membershipCard) {
      throw new NotFoundException('MembershipCard not found!');
    }
    const today = new Date();
    const startDate = new Date().toLocaleDateString('en-CA');
    const duration = parseInt(membershipCard.validity);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + duration - 1);
    const endDateString = endDate.toLocaleDateString('en-CA');
    const memberId = `MEM-${Math.floor(1000 + Math.random() * 9000)}`;

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
      membershipValidFrom: startDate,
      membershipValidTo: endDateString,
      memberId: memberId,
    });
    await this.udRepo.save(udObj);
    return account;
  }

  async memberList(dto: MemberPaginationDto) {
    const keyword = dto.keyword || '';
    const startDate = new Date(dto.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dto.endDate);
    endDate.setHours(23, 59, 59, 999);

    const query = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect('userDetail.membershipCard', 'membershipCard')
      .select([
        'account.id',
        'account.phoneNumber',
        'account.roles',
        // 'account.status',
        'account.createdAt',

        'userDetail.id',
        'userDetail.memberId',
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
        'userDetail.membershipValidFrom',
        'userDetail.membershipValidTo',
        'userDetail.cardNumber',
        'userDetail.landMark',
        'userDetail.fatherName',
        'userDetail.dob',
        'userDetail.qualification',
        'userDetail.profession',
        'userDetail.panNumber',
        'userDetail.income',
        'userDetail.status',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
      ])
      .where('account.roles = :roles', { roles: UserRole.USER });
    if (dto.status && dto.status.length > 0) {
      query.andWhere('userDetail.status = :status', {
        status: dto.status,
      });
    }
    if (dto.phoneNumber && dto.phoneNumber.length > 0) {
      query.andWhere('account.phoneNumber = :phoneNumber', {
        phoneNumber: dto.phoneNumber,
      });
    }
    if (dto.membershipType && dto.membershipType.length > 0) {
      query.andWhere('membershipCard.name = :name', {
        name: dto.membershipType,
      });
    }
    if (dto.memberId && dto.memberId.length > 0) {
      query.andWhere('userDetail.memberId = :memberId', {
        memberId: dto.memberId,
      });
    }
    // if (dto.startDate && dto.endDate) {
    //   query.andWhere(
    //     'userDetail.membershipValidFrom >= :startDate AND userDetail.membershipValidTo <= :endDate',
    //     {
    //       startDate: startDate,
    //       endDate: endDate,
    //     },
    //   );
    // }
    if (dto.keyword && dto.keyword.length > 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'userDetail.fName LIKE :keyword OR userDetail.mName LIKE :keyword OR userDetail.lName LIKE :keyword OR userDetail.gender LIKE :keyword OR userDetail.address1 LIKE :keyword OR userDetail.address2 LIKE :keyword OR userDetail.businessName LIKE :keyword OR userDetail.gstNumber LIKE :keyword',
            {
              keyword: '%' + keyword + '%',
            },
          );
        }),
      );
    }
    const [result, total] = await query
      .orderBy({ 'account.createdAt': 'DESC' })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, total };
  }

  async findOneMember(accountId: string) {
    const result = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect('userDetail.membershipCard', 'membershipCard')
      .leftJoinAndSelect('membershipCard.cardAmenities', 'cardAmenities')
      .leftJoinAndSelect('account.userChild', 'userChild')
      .select([
        'account.id',
        'account.phoneNumber',
        'account.roles',
        'account.status',
        'account.createdAt',

        'userDetail.id',
        'userDetail.memberId',
        'userDetail.membershipValidFrom',
        'userDetail.membershipValidTo',
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
        'userDetail.cardNumber',
        'userDetail.landMark',
        'userDetail.fatherName',
        'userDetail.dob',
        'userDetail.qualification',
        'userDetail.profession',
        'userDetail.panNumber',
        'userDetail.income',
        'userDetail.status',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
        'membershipCard.cardDesign',

        'cardAmenities.id',
        'cardAmenities.name',
        'cardAmenities.icon',
        'cardAmenities.desc',
        'cardAmenities.shortDesc',

        'userChild.id',
        'userChild.memberId',
        'userChild.name',
        'userChild.email',
        'userChild.phoneNumber',
        'userChild.relation',
        'userChild.martialStatus',
        'userChild.profile',
        'userChild.createAt',
        'userChild.updatedAt',
      ])
      .where('account.id = :id', { id: accountId })
      .getOne();
    return result;
  }

  async findBySearch(dto: SearchMemberPaginationDto) {
    const result = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect('userDetail.membershipCard', 'membershipCard')
      .leftJoinAndSelect('membershipCard.cardAmenities', 'cardAmenities')
      .leftJoinAndSelect('account.userChild', 'userChild')
      .select([
        'account.id',
        'account.phoneNumber',
        'account.roles',
        'account.status',
        'account.createdAt',

        'userDetail.id',
        'userDetail.memberId',
        'userDetail.membershipValidFrom',
        'userDetail.membershipValidTo',
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
        'userDetail.cardNumber',
        'userDetail.landMark',
        'userDetail.fatherName',
        'userDetail.dob',
        'userDetail.qualification',
        'userDetail.profession',
        'userDetail.panNumber',
        'userDetail.income',
        'userDetail.status',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
        'membershipCard.cardDesign',

        'cardAmenities.id',
        'cardAmenities.name',
        'cardAmenities.icon',
        'cardAmenities.desc',
        'cardAmenities.shortDesc',

        'userChild.id',
        'userChild.memberId',
        'userChild.name',
        'userChild.email',
        'userChild.phoneNumber',
        'userChild.relation',
        'userChild.martialStatus',
        'userChild.profile',
        'userChild.createAt',
        'userChild.updatedAt',
      ])
      .where(
        'account.phoneNumber = :phoneNumber OR userChild.phoneNumber = :uPhoneNumber OR userDetail.memberId = :memberId',
        {
          phoneNumber: dto.phoneNumber,
          uPhoneNumber: dto.phoneNumber,
          memberId: dto.memberId,
        },
      )
      .getOne();
    return result;
  }

  async findChildList(dto: PaginationChildDto) {
    const keyword = dto.keyword || '';
    const startDate = new Date(dto.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dto.endDate);
    endDate.setHours(23, 59, 59, 999);

    const query = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect('userDetail.membershipCard', 'membershipCard')
      .leftJoinAndSelect('account.userChild', 'userChild')
      .select([
        'account.id',
        'account.phoneNumber',
        'account.roles',
        // 'account.status',
        'account.createdAt',

        'userDetail.id',
        'userDetail.memberId',
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
        'userDetail.membershipValidFrom',
        'userDetail.membershipValidTo',
        'userDetail.cardNumber',
        'userDetail.landMark',
        'userDetail.fatherName',
        'userDetail.dob',
        'userDetail.qualification',
        'userDetail.profession',
        'userDetail.panNumber',
        'userDetail.income',
        'userDetail.status',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',

        'userChild.id',
        'userChild.memberId',
        'userChild.name',
        'userChild.email',
        'userChild.phoneNumber',
        'userChild.relation',
        'userChild.martialStatus',
        'userChild.profile',
        'userChild.createAt',
        'userChild.updatedAt',
      ])
      .where('account.roles = :roles', { roles: UserRole.USER });
    if (dto.status && dto.status.length > 0) {
      query.andWhere('userDetail.status = :status', {
        status: dto.status,
      });
    }
    if (dto.phoneNumber && dto.phoneNumber.length > 0) {
      query.andWhere('userChild.phoneNumber = :phoneNumber', {
        phoneNumber: dto.phoneNumber,
      });
    }
    if (dto.membershipType && dto.membershipType.length > 0) {
      query.andWhere('membershipCard.name = :name', {
        name: dto.membershipType,
      });
    }
    if (dto.memberId && dto.memberId.length > 0) {
      query.andWhere('userChild.memberId = :memberId', {
        memberId: dto.memberId,
      });
    }
    // if (dto.startDate && dto.endDate) {
    //   query.andWhere(
    //     'userDetail.membershipValidFrom >= :startDate AND userDetail.membershipValidTo <= :endDate',
    //     {
    //       startDate: startDate,
    //       endDate: endDate,
    //     },
    //   );
    // }
    const [result, total] = await query
      .orderBy({ 'account.createdAt': 'DESC' })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, total };
  }

  async businessProfile(accountId: string) {
    const result = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.business', 'business')
      .leftJoinAndSelect('business.licence', 'licence')
      .leftJoinAndSelect('account.setting', 'setting')
      .leftJoinAndSelect('account.tax', 'tax')
      .leftJoinAndSelect('account.membershipCard', 'membershipCard')
      .select([
        'account.id',
        'account.email',
        'account.phoneNumber',
        'account.roles',
        'account.createdAt',

        'business.id',
        'business.gender',
        'business.personName',
        'business.personEmail',
        'business.personPhone',
        'business.businessKey',
        'business.businessType',
        'business.businessName',
        'business.parentCompanyName',
        'business.businessPhone',
        'business.businessEmail',
        'business.gstNo',
        'business.address1',
        'business.address2',
        'business.zipCode',
        'business.city',
        'business.state',
        'business.country',
        'business.signatory',
        'business.logo',
        'business.brandLogo',
        'business.doc1',
        'business.doc2',
        'business.gstCertificate',
        'business.workOrder',
        'business.status',
        'business.accountId',
        'business.createdAt',
        'business.updatedAt',

        'licence.id',
        'licence.businessId',
        'licence.userLimit',
        'licence.licenceKey',
        'licence.activationKey',
        'licence.startDate',
        'licence.renewalDate',
        'licence.amc',
        'licence.createdAt',
        'licence.status',

        'setting.id',
        'setting.title',
        'setting.user_domain',
        'setting.admin_domain',
        'setting.mobile_domain',
        'setting.dateFormat',
        'setting.timeFormat',
        'setting.timeZone',
        'setting.currency',
        'setting.createdAt',

        'tax.id',
        'tax.taxName',
        'tax.rate',
        'tax.status',
        'tax.createdAt',
        'tax.updatedAt',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.cardType',
        'membershipCard.desc',
        'membershipCard.memberCount',
        'membershipCard.status',
        'membershipCard.cardDesign',
        'membershipCard.createdAt',
      ])
      .where('account.id = :id', { id: accountId })
      .getOne();
    return result;
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
        'userDetail.memberId',
        'userDetail.membershipValidFrom',
        'userDetail.membershipValidTo',
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
        'userDetail.cardNumber',
        'userDetail.landMark',
        'userDetail.fatherName',
        'userDetail.dob',
        'userDetail.qualification',
        'userDetail.profession',
        'userDetail.panNumber',
        'userDetail.income',
        'userDetail.status',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
        'membershipCard.cardDesign',
      ])
      .where('account.id = :id', { id: accountId })
      .getOne();
    return result;
  }

  async userDetailQRCode(accountId: string) {
    const userProfile = await this.repo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect('userDetail.membershipCard', 'membershipCard')
      .leftJoinAndSelect('account.userChild', 'userChild')
      .select([
        'account.id',
        'account.phoneNumber',
        'account.roles',
        'account.createdAt',

        'userDetail.id',
        'userDetail.memberId',
        'userDetail.membershipValidFrom',
        'userDetail.membershipValidTo',
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
        'userDetail.businessType',
        'userDetail.businessName',
        'userDetail.memberDoc',
        'userDetail.gstNumber',
        'userDetail.businessDoc',
        'userDetail.businessCity',
        'userDetail.businessState',
        'userDetail.businessZipcode',
        'userDetail.businessPhone',
        'userDetail.cardNumber',
        'userDetail.landMark',
        'userDetail.fatherName',
        'userDetail.dob',
        'userDetail.qualification',
        'userDetail.profession',
        'userDetail.panNumber',
        'userDetail.income',
        'userDetail.status',

        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
        'membershipCard.cardDesign',

        'userChild.id',
        'userChild.memberId',
        'userChild.name',
        'userChild.email',
        'userChild.phoneNumber',
        'userChild.relation',
        'userChild.martialStatus',
        'userChild.profile',
        'userChild.createAt',
        'userChild.updatedAt',
      ])
      .where('account.id = :id', { id: accountId })
      .getOne();
    if (!userProfile) {
      throw new Error('User not found');
    }
    const qrCode = await generateQrCode(userProfile);
    return { qrCode: qrCode };
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
