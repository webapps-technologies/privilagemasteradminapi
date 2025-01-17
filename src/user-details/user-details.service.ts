import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Brackets, Repository } from 'typeorm';
import { PaginationSDto, UpdateUserDetailDto } from './dto/update-user-details';
import { UserDetail } from './entities/user-detail.entity';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetail) private readonly repo: Repository<UserDetail>,
    @InjectRepository(Account)
    private readonly accountrepo: Repository<Account>,
  ) {}

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { accountId: id } });
    if (!result) {
      throw new NotFoundException('User not found!');
    }
    return result;
  }

  async update(dto: UpdateUserDetailDto, accountId: string) {
    const result = await this.repo.findOne({ where: { accountId: accountId } });
    if (!result) {
      throw new NotFoundException('User profile not found!');
    }
    if (dto.totalExpYear >= '1') {
      const obj = Object.assign(result, {
        workStatus: 'WORKING',
        totalExpYear: dto.totalExpYear,
        totalExpMonth: dto.totalExpMonth,
      });
      return this.repo.save(obj);
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async profileImage(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      profile: process.env.PV_CDN_LINK + image,
      profileName: image,
    });
    return this.repo.save(obj);
  }
}
