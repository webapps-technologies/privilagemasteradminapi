import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from 'src/business/entities/business.entity';
import { BusinessStatus, YNStatus } from 'src/enum';
import { Licence } from 'src/licence/entities/licence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Licence)
    private readonly licenceRepo: Repository<Licence>,
  ) {}

  async businessCount() {
    const activeBusiness = await this.businessRepo.count({
      where: { status: BusinessStatus.ACTIVE },
    });

    const renewalBusiness = await this.businessRepo.count({
      where: { status: BusinessStatus.RENEWAL },
    });

    const expiredBusiness = await this.businessRepo.count({
      where: { status: BusinessStatus.EXPERIED },
    });

    return {
      activeBusiness: activeBusiness,
      renewalBusiness: renewalBusiness,
      expiredBusiness: expiredBusiness,
    };
  }

  async amcUsers() {
    const result = await this.licenceRepo.count({
      where: { amc: YNStatus.YES },
    });

    return { amcUser: result };
  }
}
