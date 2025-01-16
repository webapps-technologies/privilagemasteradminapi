import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { Brackets, Like, Repository } from 'typeorm';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatus } from 'src/enum';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract) private readonly repo: Repository<Contract>,
  ) {}

  async create(dto: CreateContractDto) {
    const result = await this.repo.findOne({
      where: { contractName: dto.contractName },
    });
    if (result) {
      throw new ConflictException(
        'Contract Already Exists With This Contract Name!',
      );
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.contractType', 'contractType')
      .select([
        'contract.id',
        'contract.contractName',
        'contract.contractTypeId',
        'contract.validFrom',
        'contract.validTill',
        'contract.desc',
        'contract.status',
        'contract.createdAt',
        'contract.updatedAt',

        'contractType.id',
        'contractType.name',
      ])
      .where('contract.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'contract.contractName LIKE :keyword OR contractType.name LIKE :keyword',
            {
              keyword: '%' + keyword + '%',
            },
          );
        }),
      )
      .orderBy({ 'contract.createdAt': 'DESC' })
      .getManyAndCount();

    return { result, total };
  }

  async findList(dto: CommonPaginationDto) {
    const [result, total] = await this.repo
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.contractType', 'contractType')
      .select([
        'contract.id',
        'contract.contractName',
        'contract.contractTypeId',
        'contract.validFrom',
        'contract.validTill',
        'contract.desc',
        'contract.status',
        'contract.createdAt',
        'contract.updatedAt',

        'contractType.id',
        'contractType.name',
      ])
      .where('contract.status = :status', { status: DefaultStatus.ACTIVE })
      .orderBy({ 'contract.createdAt': 'DESC' })
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async update(id: string, dto: UpdateContractDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Contract Not Found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Contract Not Found!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
