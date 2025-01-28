import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenity } from './entities/amenity.entity';
import { Brackets, Repository } from 'typeorm';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity) private readonly repo: Repository<Amenity>,
  ) {}

  async create(dto: CreateAmenityDto, accountId: string) {
    const result = await this.repo.findOne({
      where: { name: dto.name, accountId: accountId },
    });
    if (result) {
      throw new ConflictException('Amenity Already Exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto, accountId: string) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('amenities')
      .where(
        'amenities.status = :status AND amenities.accountId = :accountId',
        {
          status: dto.status,
          accountId: accountId,
        },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'amenities.name LIKE :keyword OR amenities.desc LIKE :keyword OR amenities.shortDesc LIKE :keyword',
            {
              keyword: '%' + keyword + '%',
            },
          );
        }),
      )
      .getManyAndCount();
    return { result, total };
  }

  async update(id: string, dto: UpdateAmenityDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Amenities Not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async status(id: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Amenities Rate Not Found!!');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
