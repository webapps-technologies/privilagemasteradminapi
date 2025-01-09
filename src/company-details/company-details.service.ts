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

  async sendMail(accountId: string) {
    const company = await this.repo.findOne({ where: { accountId } });
    if (!company) {
      throw new NotFoundException('Account Not Found');
    }
    this.nodeMailerService.sendEmail(company.name, company.email);
    return { message: `Email Send Successfully.` };
    // return `Email Send Successfully.`;
    // return company;
  }

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

  async updateByAdmin(id: string, dto: RatingUpdateDto) {
    const result = await this.repo.findOne({ where: { accountId: id } });
    if (!result) {
      throw new NotFoundException('Company not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async updateDocStatusByAdmin(accountId: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { accountId } });
    if (!result) {
      throw new NotFoundException('Company not found!');
    }
    const obj = Object.assign(result, { docStatus: dto.status });
    return this.repo.save(obj);
  }

  async profileImage(image: string, result: CompanyDetail) {
    const obj = Object.assign(result, {
      profile: process.env.PV_CDN_LINK + image,
      profileName: image,
    });
    return this.repo.save(obj);
  }

  async hrLogo(image: string, result: CompanyDetail) {
    const obj = Object.assign(result, {
      logo: process.env.PV_CDN_LINK + image,
      logoPath: image,
    });
    return this.repo.save(obj);
  }

  async logo(image: string, result: CompanyDetail) {
    const obj = Object.assign(result, {
      logo: process.env.PV_CDN_LINK + image,
      logoPath: image,
    });
    return this.repo.save(obj);
  }

  async document(image: string, result: CompanyDetail) {
    const obj = Object.assign(result, {
      doc: process.env.PV_CDN_LINK + image,
      docPath: image,
    });
    return this.repo.save(obj);
  }
}
