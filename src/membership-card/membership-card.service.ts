import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateMembershipCardDto,
  MembershipCardPaginationDto,
} from './dto/create-membership-card.dto';
import { UpdateMembershipCardDto } from './dto/update-membership-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { MembershipCard } from './entities/membership-card.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatus } from 'src/enum';

@Injectable()
export class MembershipCardService {
  constructor(
    @InjectRepository(MembershipCard)
    private readonly repo: Repository<MembershipCard>,
  ) {}

  async create(dto: CreateMembershipCardDto) {
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: MembershipCardPaginationDto, accountId: string) {
    const keyword = dto.keyword || '';
    const query = await this.repo
      .createQueryBuilder('membershipCard')
      .leftJoinAndSelect('membershipCard.cardGallery', 'cardGallery')
      .leftJoinAndSelect('membershipCard.cardTnc', 'cardTnc')
      .leftJoinAndSelect('membershipCard.cardAmenities', 'cardAmenities')
      .leftJoinAndSelect('cardAmenities.amenities', 'amenities')
      .select([
        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
        'membershipCard.cardDesign',
        'membershipCard.status',
        'membershipCard.createdAt',
        'membershipCard.accountId',

        'cardGallery.id',
        'cardGallery.image',

        'cardTnc.id',
        'cardTnc.terms',

        'cardAmenities.id',
        'amenities.id',
        'amenities.name',
        'amenities.icon',
        'amenities.desc',
        'amenities.shortDesc',
      ])
      .where(
        'membershipCard.status = :status AND membershipCard.accountId = :accountId',
        { status: dto.status, accountId: accountId },
      );
    if (keyword.length > 0) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'membershipCard.validYear LIKE :keyword OR membershipCard.validMonth LIKE :keyword OR amenities.name LIKE :keyword',
            {
              keyword: '%' + keyword + '%',
            },
          );
        }),
      );
    }
    const [result, total] = await query
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async find(dto: CommonPaginationDto, accountId: string) {
    const keyword = dto.keyword || '';
    const query = await this.repo
      .createQueryBuilder('membershipCard')
      .leftJoinAndSelect('membershipCard.cardGallery', 'cardGallery')
      .leftJoinAndSelect('membershipCard.cardTnc', 'cardTnc')
      .leftJoinAndSelect('membershipCard.cardAmenities', 'cardAmenities')
      .leftJoinAndSelect('cardAmenities.amenities', 'amenities')
      .select([
        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
        'membershipCard.cardDesign',
        'membershipCard.status',
        'membershipCard.createdAt',
        'membershipCard.accountId',

        'cardGallery.id',
        'cardGallery.image',

        'cardTnc.id',
        'cardTnc.terms',

        'cardAmenities.id',
        'amenities.id',
        'amenities.name',
        'amenities.icon',
        'amenities.desc',
        'amenities.shortDesc',
      ])
      .where(
        'membershipCard.status = :status AND membershipCard.accountId = :accountId',
        { status: DefaultStatus.ACTIVE, accountId: accountId },
      );
    const [result, total] = await query
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();
    return { result, total };
  }

  async findOneByUser(id: string) {
    const result = await this.repo
      .createQueryBuilder('membershipCard')
      .leftJoinAndSelect('membershipCard.cardGallery', 'cardGallery')
      .leftJoinAndSelect('membershipCard.cardTnc', 'cardTnc')
      .leftJoinAndSelect('membershipCard.cardAmenities', 'cardAmenities')
      .leftJoinAndSelect('cardAmenities.amenities', 'amenities')
      .select([
        'membershipCard.id',
        'membershipCard.name',
        'membershipCard.validity',
        'membershipCard.price',
        'membershipCard.currencyType',
        'membershipCard.memberCount',
        'membershipCard.cardDesign',
        'membershipCard.status',
        'membershipCard.createdAt',
        'membershipCard.accountId',

        'cardGallery.id',
        'cardGallery.image',

        'cardTnc.id',
        'cardTnc.terms',

        'cardAmenities.id',
        'amenities.id',
        'amenities.name',
        'amenities.icon',
        'amenities.desc',
        'amenities.shortDesc',
      ])
      .where('membershipCard.status = :status AND membershipCard.id = :id', {
        status: DefaultStatus.ACTIVE,
        id: id,
      })
      .getOne();
    return result;
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateMembershipCardDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Card Not Found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async cardDesign(image: string, result: MembershipCard) {
    const obj = Object.assign(result, {
      cardDesign: process.env.PV_CDN_LINK + image,
      cardDesignPath: image,
    });
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Card Not Found!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
