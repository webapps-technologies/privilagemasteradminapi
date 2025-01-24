import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tax } from './entities/tax.entity';
import { Brackets, Repository } from 'typeorm';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Injectable()
export class TaxService {
  constructor(@InjectRepository(Tax) private readonly repo: Repository<Tax>) {}

  async create(dto: CreateTaxDto, accountId: string) {
    const result = await this.repo.findOne({
      where: { taxName: dto.taxName, accountId: accountId },
    });
    if (result) {
      throw new ConflictException('Tax Already Exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto, accountId: string) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('tax')
      .where('tax.status = :status AND tax.accountId = :accountId', {
        status: dto.status,
        accountId: accountId,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('tax.taxName LIKE :keyword OR tax.rate LIKE :keyword', {
            keyword: '%' + keyword + '%',
          });
        }),
      )
      .getManyAndCount();
    return { result, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} tax`;
  }

  async update(id: string, dto: UpdateTaxDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Tax Not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  remove(id: number) {
    return `This action removes a #${id} tax`;
  }
}
