import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessPageDto } from './dto/create-business-page.dto';
import { UpdateBusinessPageDto } from './dto/update-business-page.dto';
import { BusinessPage } from './entities/business-page.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class BusinessPageService {
  constructor(
    @InjectRepository(BusinessPage)
    private readonly repo: Repository<BusinessPage>,
  ) {}

  async create(dto: CreateBusinessPageDto, accountId: string) {
    const result = await this.repo.findOne({
      where: { name: dto.name, accountId: accountId },
    });
    if (result) {
      throw new ConflictException('Page already exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto, accountId: string) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo.findAndCount({
      where: { status: dto.status, accountId, name: Like('%' + keyword + '%') },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, total };
  }

  async getActivePages(dto: CommonPaginationDto, accountId: string ){
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo.findAndCount({
      where: { status: DefaultStatus.ACTIVE, accountId, name: Like('%' + keyword + '%') },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, total };
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateBusinessPageDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Page not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Page not found!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
