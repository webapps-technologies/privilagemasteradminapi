import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateLicenceDto,
  LicencePaginationDto,
} from './dto/create-licence.dto';
import { UpdateLicenceDto } from './dto/update-licence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Licence } from './entities/licence.entity';
import { Brackets, Repository } from 'typeorm';
import { LicencePlan } from 'src/licence-plan/entities/licence-plan.entity';
import { DefaultStatus } from 'src/enum';
import { Business } from 'src/business/entities/business.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class LicenceService {
  constructor(
    @InjectRepository(Licence) private readonly repo: Repository<Licence>,
    @InjectRepository(LicencePlan)
    private readonly licencePlanRepo: Repository<LicencePlan>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
  ) {}

  async create(dto: CreateLicenceDto) {
    const result = await this.repo.findOne({
      where: { businessId: dto.businessId, status: DefaultStatus.ACTIVE },
    });
    if (result) {
      throw new ConflictException(
        'This business already have an active licence!',
      );
    }
    const business = await this.businessRepo.findOne({
      where: { id: dto.businessId },
    });
    if (!business) {
      throw new NotFoundException('Business Not Found with this businessId!');
    }
    const plan = await this.planRepo.findOne({ where: { id: dto.planId } });
    if (!plan) {
      throw new NotFoundException('Plan Not Found with this planId!');
    }

    const businessName = business.businessName.toUpperCase().slice(0, 3);
    const businessGST = business.gstNo.slice(0, 4);
    const businessPh = business.personPhone.slice(7, 10);
    const date = new Date().getDate();
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2);
    const currentDate = new Date();
    const istDate = new Date(
      currentDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    );
    const hours = istDate.getHours().toString().padStart(2, '0');
    const minutes = istDate.getMinutes().toString().padStart(2, '0');
    const aplhaNum = await this.generateLicenceKey();

    const licenceKey = `${businessName}${businessGST}${businessPh}${date}${month}${hours}${minutes}${aplhaNum}`;
    const activationKey = await this.generateActivationKey();

    const today = new Date();
    const startDate = new Date().toLocaleDateString('en-CA');
    const duration = parseInt(plan.duration);
    const renewalDate = new Date(today);
    renewalDate.setDate(today.getDate() + duration - 1);
    const renewalDateString = renewalDate.toLocaleDateString('en-CA');

    const obj = Object.create({
      licenceKey: licenceKey,
      activationKey: activationKey,
      businessId: dto.businessId,
      userLimit: dto.userLimit,
      startDate: startDate,
      renewalDate: renewalDateString,
    });
    const licence = await this.repo.save(obj);

    const lpObj = Object.create({ licenceId: licence.id, planId: dto.planId });
    await this.licencePlanRepo.save(lpObj);

    return licence;
  }

  async findAll(dto: LicencePaginationDto) {
    const keyword = dto.keyword || '';

    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 999);

    const query = await this.repo
      .createQueryBuilder('licence')
      .leftJoinAndSelect('licence.business', 'business')
      .leftJoinAndSelect('licence.licencePlan', 'licencePlan')
      .leftJoinAndSelect('licencePlan.plan', 'plan')
      .select([
        'licence.id',
        'licence.businessId',
        'licence.userLimit',
        'licence.licenceKey',
        'licence.activationKey',
        'licence.startDate',
        'licence.renewalDate',
        'licence.createdAt',
        'licence.status',

        'business.id',
        'business.businessName',

        'licencePlan.id',
        'plan.id',
        'plan.packageName',
        'plan.duration',
        'plan.price',
        'plan.mrp',
        'plan.membership',
        'plan.amcPrice',
        'plan.status',
        'plan.createdAt',
      ])
      .where('licence.status = :status', { status: dto.status });
    if (dto.fromDate && dto.toDate) {
      query.andWhere(
        'licence.createdAt >= :fromDate AND licence.createdAt <= :toDate',
        {
          fromDate: fromDate,
          toDate: toDate,
        },
      );
    }
    if (dto.keyword && dto.keyword.length > 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('business.businessName LIKE :keyword', {
            keyword: '%' + keyword + '%',
          });
        }),
      );
    }

    const [result, total] = await query
      .orderBy({ 'licence.createdAt': 'DESC' })
      .getManyAndCount();

    return { result, total };
  }

  async findLicenece(businessId: string) {
    const result = await this.repo
      .createQueryBuilder('licence')
      .leftJoinAndSelect('licence.business', 'business')
      .leftJoinAndSelect('licence.licencePlan', 'licencePlan')
      .leftJoinAndSelect('licencePlan.plan', 'plan')
      .select([
        'licence.id',
        'licence.businessId',
        'licence.userLimit',
        'licence.licenceKey',
        'licence.activationKey',
        'licence.startDate',
        'licence.renewalDate',
        'licence.createdAt',
        'licence.status',

        'business.id',
        'business.businessName',

        'licencePlan.id',
        'plan.id',
        'plan.packageName',
        'plan.duration',
        'plan.price',
        'plan.mrp',
        'plan.membership',
        'plan.amcPrice',
        'plan.status',
        'plan.createdAt',
      ])
      .where('licence.businessId = :businessId', { businessId: businessId })
      .getOne();

    return result;
  }

  async downloadLicenceCsv(dto: LicencePaginationDto) {
    const { result } = await this.findAll(dto);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        // { id: 'id', title: 'Licence ID' },
        // { id: 'businessName', title: 'Business Name' },
        { id: 'userLimit', title: 'User Limit' },
        { id: 'licenceKey', title: 'Licence Key' },
        { id: 'activationKey', title: 'Activation Key' },
        { id: 'startDate', title: 'Start Date' },
        { id: 'renewalDate', title: 'Renewal Date' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'status', title: 'Status' },
        // { id: 'packageName', title: 'Package Name' },
        // { id: 'price', title: 'Price' },
        // { id: 'mrp', title: 'MRP' },
        // { id: 'membership', title: 'Membership' },
        // { id: 'duration', title: 'Duration' },
        // { id: 'amcPrice', title: 'AMC Price' },
      ],
    });

    // Map the API response to the CSV format
    const records = result.map((item) => {
      const businessName = item.business || 'N/A';
    
      return {
        // businessName,
        userLimit: item.userLimit,
        licenceKey: item.licenceKey,
        activationKey: item.activationKey,
        startDate: item.startDate,
        renewalDate: item.renewalDate,
        createdAt: item.createdAt,
        status: item.status,
      };
    });    

    // Generate CSV content
    const csvContent =
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(records);
    return csvContent;
  }

  async pdf(dto: LicencePaginationDto) {
    const keyword = dto.keyword || '';

    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 999);

    const query = await this.repo
      .createQueryBuilder('licence')
      .leftJoinAndSelect('licence.business', 'business')
      .leftJoinAndSelect('licence.licencePlan', 'licencePlan')
      .leftJoinAndSelect('licencePlan.plan', 'plan')
      .select([
        'licence.id',
        'licence.businessId',
        'licence.userLimit',
        'licence.licenceKey',
        'licence.activationKey',
        'licence.startDate',
        'licence.renewalDate',
        'licence.createdAt',
        'licence.status',

        'business.id',
        'business.businessName',

        'licencePlan.id',
        'plan.id',
        'plan.packageName',
        'plan.duration',
        'plan.price',
        'plan.mrp',
        'plan.membership',
        'plan.amcPrice',
        'plan.status',
        'plan.createdAt',
      ])
      .where('licence.status = :status', { status: dto.status });
    if (dto.fromDate && dto.toDate) {
      query.andWhere(
        'licence.createdAt >= :fromDate AND licence.createdAt <= :toDate',
        {
          fromDate: fromDate,
          toDate: toDate,
        },
      );
    }
    if (dto.keyword && dto.keyword.length > 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('business.businessName LIKE :keyword', {
            keyword: '%' + keyword + '%',
          });
        }),
      );
    }

    const result = await query
      .orderBy({ 'licence.createdAt': 'DESC' })
      .getMany();

    return result;
  }

  async renewal(id: string, planId: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Licence Not Found!!');
    }
    const plan = await this.planRepo.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException('Plan Not Found with this planId!');
    }
    const findPlan = await this.licencePlanRepo.find({
      where: { licenceId: id },
    });
    await this.licencePlanRepo.remove(findPlan);

    const today = new Date();
    const startDate = new Date().toLocaleDateString('en-CA');
    const duration = parseInt(plan.duration);
    const renewalDate = new Date(today);
    renewalDate.setDate(today.getDate() + duration - 1);
    const renewalDateString = renewalDate.toLocaleDateString('en-CA');

    const obj = Object.assign(result, {
      startDate: startDate,
      renewalDate: renewalDateString,
    });
    const renewed = await this.repo.save(obj);

    const lpObj = Object.create({ licenceId: id, planId: planId });
    await this.licencePlanRepo.save(lpObj);

    return renewed;
  }

  async update(id: string, dto: UpdateLicenceDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Licence Not Found!!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Licence Not Found!!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }

  private async generateLicenceKey() {
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }

  private async generateActivationKey() {
    let code = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;
  }
}
