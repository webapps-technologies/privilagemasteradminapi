import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessTypeDto } from './dto/create-business-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessType } from './entities/business-type.entity';
import { Like, Repository } from 'typeorm';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Injectable()
export class BusinessTypeService {
  constructor(
    @InjectRepository(BusinessType)
    private readonly repo: Repository<BusinessType>,
  ) {}

  async create(dto: CreateBusinessTypeDto) {
    const result = await this.repo.findOne({ where: { name: dto.name } });
    if (result) {
      throw new ConflictException('Business Type Already Exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo.findAndCount({
      where: { status: dto.status, name: Like(`%${keyword}%`) },
      take: dto.limit,
      skip: dto.offset,
    });
    return {result, total};
  }

  async update(id: string, dto: CreateBusinessTypeDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Business Type Not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Business Type Not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
