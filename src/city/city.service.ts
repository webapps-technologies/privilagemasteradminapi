import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoolStatusDto } from 'src/common/dto/bool-status.dto';
import { Brackets, Repository } from 'typeorm';
import { CityDto, PaginationSDto, UpdateCityDto } from './dto/city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly repo: Repository<City>,
  ) {}

  async create(dto: CityDto) {
    const city = await this.repo.findOne({
      where: { name: dto.name, stateId: dto.stateId },
    });
    if (city) {
      throw new ConflictException('City already exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: PaginationSDto) {
    const keyword = dto.keyword || '';
    const query = await this.repo.createQueryBuilder('city');
    query.where('city.status = :status', { status: dto.status });
    if (dto.stateId) {
      query.andWhere('city.stateId = :stateId', {
        stateId: dto.stateId,
      });
    }
    const [result, count] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where('city.name LIKE :pname', {
            pname: '%' + keyword + '%',
          });
        }),
      )
      .orderBy(
        `CASE WHEN city.name LIKE '${keyword}%' THEN 0 ELSE 1 END, city.name`,
        'ASC',
      )
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, count };
  }

  async update(id: number, dto: UpdateCityDto) {
    try {
      const city = await this.repo.findOne({ where: { id } });
      if (!city) {
        throw new NotFoundException('City not found!');
      }
      const obj = Object.assign(city, { name: dto.name });
      return this.repo.save(obj);
    } catch (error) {
      throw new NotAcceptableException(
        'Either catgeory exists or invalid name!',
      );
    }
  }

  async status(id: number, dto: BoolStatusDto) {
    const city = await this.repo.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException('City not found!');
    }
    const obj = Object.assign(city, dto);
    return this.repo.save(obj);
  }
}
