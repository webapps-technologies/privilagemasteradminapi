import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Like, Repository } from 'typeorm';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership) private readonly repo: Repository<Membership>,
  ) {}

  async create(dto: CreateMembershipDto) {
    const result = await this.repo.findOne({ where: { name: dto.name } });
    if (result) {
      throw new ConflictException('Membership Already exists with this name!');
    }
    const obj = Object.assign(dto);
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

  async find(dto: CommonPaginationDto) {
    const [result, total] = await this.repo.findAndCount({
      where: { status: DefaultStatus.ACTIVE },
      take: dto.limit,
      skip: dto.offset,
    });
    return { result, total };
  }

  async update(id: string, dto: CreateMembershipDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Membership Not Found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Membership Not Found!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
