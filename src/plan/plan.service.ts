import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto, PlanPaginationDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DefaultStatus } from 'src/enum';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private readonly repo: Repository<Plan>,
  ) {}

  async create(dto: CreatePlanDto) {
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: PlanPaginationDto) {
    const keyword = dto.keyword || '';
    const query = await this.repo
      .createQueryBuilder('plan')
      .select([
        'plan.id',
        'plan.packageName',
        'plan.benefits',
        'plan.price',
        'plan.mrp',
        'plan.membership',
        'plan.duration',
        'plan.amcPrice',
        'plan.termsAndCond',
        'plan.type',
        'plan.status',
        'plan.businessId',
        'plan.createdAt',
        'plan.updatedAt',
      ]);
    if (dto.status && dto.status.length > 0) {
      query.andWhere('plan.status = :status', { status: dto.status });
    }
    if (dto.type && dto.type.length > 0) {
      query.andWhere('plan.type = :type', { type: dto.type });
    }
    if (dto.businessId && dto.businessId.length > 0) {
      query.andWhere('plan.businessId = :businessId', {
        businessId: dto.businessId,
      });
    }
    if (keyword) {
      query.andWhere(
        new Brackets((qb) => {
          qb.andWhere(
            'plan.packageName LIKE :keyword OR plan.price LIKE :keyword OR plan.mrp LIKE :keyword OR plan.membership LIKE :keyword OR plan.duration LIKE :keyword OR plan.amcPrice LIKE :keyword',
            {
              keyword: '%' + keyword + '%',
            },
          );
        }),
      );
    }
    const [result, total] = await query
      .orderBy({ 'plan.createdAt': 'DESC' })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, total };
  }

  async findForLicense(dto: CommonPaginationDto, businessId: string) {
    const query = await this.repo
      .createQueryBuilder('plan')
      .select([
        'plan.id',
        'plan.packageName',
        'plan.benefits',
        'plan.price',
        'plan.mrp',
        'plan.membership',
        'plan.duration',
        'plan.amcPrice',
        'plan.termsAndCond',
        'plan.type',
        'plan.status',
        'plan.businessId',
        'plan.createdAt',
        'plan.updatedAt',
      ])
      .where(
        'plan.status = :status AND plan.businessId = :businessId OR plan.businessId IS NULL',
        { status: DefaultStatus.ACTIVE, businessId: businessId },
      );
    const [result, total] = await query
      .orderBy({ 'plan.createdAt': 'DESC' })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, total };
  }

  async update(id: string, dto: UpdatePlanDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Plan Not Found With This ID!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Plan Not Found With This ID!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
