import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BusinessPaginationDto,
  BusinessStatusDto,
  CreateBusinessDto,
  EmailVerifyDto,
  PhoneVerifyDto,
} from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Brackets, Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { sendOtp } from 'src/utils/sms.utils';
import { BusinessStatus } from 'src/enum';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business) private readonly repo: Repository<Business>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly nodeMailerService: NodeMailerService,
  ) {}

  async sendOTPEmail(dto: EmailVerifyDto) {
    const otp = 7832;
    // const otp = Math.floor(100000 + Math.random() * 9000);
    // this.nodeMailerService.sendOtpInEmailBusiness(dto.email, otp);
    this.cacheManager.set(dto.email, otp, 10 * 60 * 1000); // for 10 mins
    return { message: 'OTP sent to the email!' };
  }

  async verifyEmail(dto: EmailVerifyDto) {
    const storedOtp = await this.cacheManager.get<string>(dto.email);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP Matched!' };
  }

  async sendOTPPhone(dto: PhoneVerifyDto) {
    const otp = 7832;
    // const otp = Math.floor(1000 + Math.random() * 9000);
    // sendOtp(parseInt(dto.phoneNumber), otp);
    this.cacheManager.set(dto.phoneNumber, otp, 10 * 60 * 1000);
    return { message: 'OTP sent to the Phone Number!' };
  }

  async verifyPhone(dto: PhoneVerifyDto) {
    const storedOtp = await this.cacheManager.get<string>(dto.phoneNumber);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP Matched!' };
  }

  async create(dto: CreateBusinessDto) {
    const result = await this.repo.findOne({
      where: { businessName: dto.businessName },
    });
    if (result) {
      throw new ConflictException('Business Already exists with this name!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: BusinessPaginationDto) {
    const keyword = dto.keyword || '';

    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 999);

    const query = await this.repo
      .createQueryBuilder('business')
      .leftJoinAndSelect('business.licence', 'licence')
      .select([
        'business.id',
        'business.gender',
        'business.personName',
        'business.personEmail',
        'business.personPhone',
        'business.businessKey',
        'business.businessType',
        'business.businessName',
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
      ])
      .where('business.status = :status', { status: dto.status });
    if (dto.fromDate && dto.toDate) {
      query.andWhere(
        'business.createdAt >= :fromDate AND business.createdAt <= :toDate',
        {
          fromDate: fromDate,
          toDate: toDate,
        },
      );
    }

    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'business.personPhone LIKE :keyword OR business.gstNo LIKE :keyword OR business.businessName LIKE :keyword',
            {
              keyword: '%' + keyword + '%',
            },
          );
        }),
      )
      .orderBy({ 'business.createdAt': 'DESC' })
      .take(dto.limit)
      .offset(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.repo
      .createQueryBuilder('business')
      .leftJoinAndSelect('business.licence', 'licence')
      .select([
        'business.id',
        'business.gender',
        'business.personName',
        'business.personEmail',
        'business.personPhone',
        'business.businessKey',
        'business.businessType',
        'business.businessName',
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
      ])
      .where('business.id = :id', { id: id })
      .getOne();
    return result;
  }

  async findBusiness(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateBusinessDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Business Not Found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async document1(image: string, result: Business) {
    const obj = Object.assign(result, {
      doc1: process.env.PV_CDN_LINK + image,
      doc1Path: image,
    });
    return this.repo.save(obj);
  }

  async document2(image: string, result: Business) {
    const obj = Object.assign(result, {
      doc2: process.env.PV_CDN_LINK + image,
      doc2Path: image,
    });
    return this.repo.save(obj);
  }

  async gstCertificate(image: string, result: Business) {
    const obj = Object.assign(result, {
      gstCertificate: process.env.PV_CDN_LINK + image,
      gstCertificatePath: image,
    });
    return this.repo.save(obj);
  }

  async workOrder(image: string, result: Business) {
    const obj = Object.assign(result, {
      workOrder: process.env.PV_CDN_LINK + image,
      workOrderPath: image,
    });
    return this.repo.save(obj);
  }

  async logo(image: string, result: Business) {
    const obj = Object.assign(result, {
      logo: process.env.PV_CDN_LINK + image,
      logoPath: image,
    });
    return this.repo.save(obj);
  }

  async brandLogo(image: string, result: Business) {
    const obj = Object.assign(result, {
      brandLogo: process.env.PV_CDN_LINK + image,
      brandLogoPath: image,
    });
    return this.repo.save(obj);
  }

  async status(id: string, dto: BusinessStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Business Not Found!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
