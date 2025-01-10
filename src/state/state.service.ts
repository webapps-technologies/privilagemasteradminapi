import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoolStatusDto } from 'src/common/dto/bool-status.dto';
import { Brackets, Repository } from 'typeorm';
import { PaginationSDto, StateDto, StateUpdateDto } from './dto/state.dto';
import { State } from './entities/state.entity';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State) private readonly repo: Repository<State>,
  ) {}

  async create(dto: StateDto) {
    const state = await this.repo.findOne({
      where: { countryId: dto.countryId, name: dto.name },
    });
    if (state) {
      throw new ConflictException('State already exists in this country!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: PaginationSDto) {
    const keyword = dto.keyword || '';
    const query = await this.repo
      .createQueryBuilder('state')
      .where('state.status = :status', { status: dto.status });
    if (dto.countryId && dto.countryId.length > 0) {
      query.andWhere('state.countryId = :countryId', {
        countryId: dto.countryId,
      });
    }

    const [result, total] = await query
      .andWhere(
        new Brackets((qb) => {
          qb.where('state.name LIKE :pname', {
            pname: '%' + keyword + '%',
          });
        }),
      )
      .orderBy(
        `CASE WHEN state.name LIKE '${keyword}%' THEN 0 ELSE 1 END, state.name`,
        'ASC',
      )
      .take(dto.limit)
      .skip(dto.offset)
      .getManyAndCount();

    return { result, total };
  }

  async update(id: number, dto: StateUpdateDto) {
    try {
      const state = await this.repo.findOne({ where: { id } });
      if (!state) {
        throw new NotFoundException('State not found!');
      }
      const obj = Object.assign(state, dto);
      return this.repo.save(obj);
    } catch (error) {
      throw new NotAcceptableException('Either state exists or invalid name!');
    }
  }

  async status(id: number, dto: BoolStatusDto) {
    const menu = await this.repo.findOne({ where: { id } });
    if (!menu) {
      throw new NotFoundException('State not found!');
    }
    const obj = Object.assign(menu, dto);
    return this.repo.save(obj);
  }
}
