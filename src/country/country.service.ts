import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country) private readonly repo: Repository<Country>,
  ) {}

  async create(dto: CreateCountryDto) {
    const country = await this.repo.findOne({ where: { name: dto.name } });
    if (country) {
      throw new ConflictException('Coutry already exists!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: DefaultStatusPaginationDto) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('country')
      .where('country.status = :status', { status: dto.status })
      .andWhere(
        new Brackets((qb) => {
          qb.where('country.name LIKE :pname', {
            pname: '%' + keyword + '%',
          });
        }),
      )
      .orderBy(
        `CASE WHEN country.name LIKE '${keyword}%' THEN 0 ELSE 1 END, country.name`,
        'ASC',
      )
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, total };
  }

  async update(id: string, dto: CreateCountryDto) {
    try {
      const country = await this.repo.findOne({ where: { id } });
      if (!country) {
        throw new NotFoundException('Country not found!');
      }
      const obj = Object.assign(country, dto);
      return this.repo.save(obj);
    } catch (error) {
      throw new NotAcceptableException(
        'Either country exists or invalid name!',
      );
    }
  }

  async status(id: string, dto: DefaultStatusDto) {
    try {
      const country = await this.repo.findOne({ where: { id } });
      if (!country) {
        throw new NotFoundException('Country not found!');
      }
      const obj = Object.assign(country, { status: dto.status });
      return this.repo.save(obj);
    } catch (error) {
      throw new NotAcceptableException(
        'Either country exists or invalid name!',
      );
    }
  }
}
