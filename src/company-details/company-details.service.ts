import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyDetailDto, RatingUpdateDto } from './dto/company-detail.dto';
import { CompanyDetail } from './entities/company-detail.entity';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Injectable()
export class CompanyDetailsService {
  constructor(
    @InjectRepository(CompanyDetail)
    private readonly repo: Repository<CompanyDetail>,
    private readonly nodeMailerService: NodeMailerService,
  ) {}

  async findCompany(id: string) {
    const result = await this.repo
      .createQueryBuilder('companyDetail')
      .where('companyDetail.accountId = :accountId', { accountId: id })
      .getOne();
    if (!result) {
      throw new NotFoundException('Company not found!');
    }
    return result;
  }

  async update(id: string, dto: CompanyDetailDto) {
    const result = await this.repo.findOne({ where: { accountId: id } });
    if (!result) {
      throw new NotFoundException('Company not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
