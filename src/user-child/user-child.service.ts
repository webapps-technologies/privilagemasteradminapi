import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserChildDto } from './dto/create-user-child.dto';
import { UpdateUserChildDto } from './dto/update-user-child.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChild } from './entities/user-child.entity';
import { Repository } from 'typeorm';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { DefaultStatus } from 'src/enum';
import { MembershipCard } from 'src/membership-card/entities/membership-card.entity';

@Injectable()
export class UserChildService {
  constructor(
    @InjectRepository(UserChild) private readonly repo: Repository<UserChild>,
    @InjectRepository(MembershipCard)
    private readonly memCardRepo: Repository<MembershipCard>,
    @InjectRepository(UserDetail)
    private readonly udRepo: Repository<UserDetail>,
  ) {}

  async create(dto: CreateUserChildDto) {
    //check memberCount of membershipCard if exceed then show error msg.
    const user = await this.udRepo.findOne({
      where: { accountId: dto.accountId },
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    const card = await this.memCardRepo.findOne({
      where: { id: user.membershipCardId },
    });
    if (!card) {
      throw new NotFoundException('MembershipCard Not found');
    }
    const memberCount = card.memberCount;
    const childCount = await this.repo.count({
      where: { accountId: dto.accountId },
    });
    if (childCount == memberCount) {
      throw new ConflictException('Cannot add child member, limit exceeded!');
    }
    if (user.status != DefaultStatus.ACTIVE) {
      throw new ConflictException('Member is not acitve');
    }
    const child = await this.repo.findOne({
      where: { accountId: dto.accountId, name: dto.name },
    });
    if (child) {
      throw new ConflictException(
        'Child Member already exists with this name!',
      );
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateUserChildDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Child Not Found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async profileImage(image: string, result: UserChild) {
    const obj = Object.assign(result, {
      profile: process.env.PV_CDN_LINK + image,
      profilePath: image,
    });
    return this.repo.save(obj);
  }
}
