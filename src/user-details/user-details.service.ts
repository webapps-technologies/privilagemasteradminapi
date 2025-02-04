import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Brackets, Repository } from 'typeorm';
import {
  PaginationSDto,
  UpdateMemberDto,
  UpdateUserDetailDto,
} from './dto/update-user-details';
import { UserDetail } from './entities/user-detail.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

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
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async updateMember(accountId: string, dto: UpdateMemberDto) {
    const result = await this.repo.findOne({ where: { accountId: accountId } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async profileImage(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      profile: process.env.PV_CDN_LINK + image,
      profilePath: image,
    });
    return this.repo.save(obj);
  }

  async memberDoc(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      memberDoc: process.env.PV_CDN_LINK + image,
      memberDocPath: image,
    });
    return this.repo.save(obj);
  }

  async businessDoc(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      businessDoc: process.env.PV_CDN_LINK + image,
      businessDocPath: image,
    });
    return this.repo.save(obj);
  }

  async memberStatus(accountId: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { accountId: accountId } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
