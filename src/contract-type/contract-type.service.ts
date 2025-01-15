import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractTypeDto } from './dto/create-contract-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractType } from './entities/contract-type.entity';
import { Like, Repository } from 'typeorm';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ContractTypeService {
  constructor(
    @InjectRepository(ContractType)
    private readonly repo: Repository<ContractType>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateContractTypeDto) {
    const result = await this.repo.findOne({ where: { name: dto.name } });
    if (result) {
      throw new ConflictException('Contract Type Exists With This Name!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo.findAndCount({
      where: { status: dto.status, name: Like('%' + keyword + '%') },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, total };
  }

  async update(id: string, dto: CreateContractTypeDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Contract Type not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Contract Type not found!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
