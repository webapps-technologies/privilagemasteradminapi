import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly repo: Repository<News>,
  ) {}

  async create(dto: CreateNewsDto, accountId: string) {
    const result = await this.repo.findOne({
      where: { heading: dto.heading, accountId: accountId },
    });
    if (result) {
      throw new ConflictException('News already exists!');
    }
    const obj = Object.create(dto);
    return this.repo.save(obj);
  }

  async findAll(dto: CommonPaginationDto, accountId: string) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('news')
      .select([
        'news.id',
        'news.heading',
        'news.desc',
        'news.image',
        'news.createdAt',
      ])
      .where('news.accountId = :accountId', { accountId: accountId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('news.heading LIKE :keyword OR news.desc LIKE :keyword', {
            keyword: '%' + keyword + '%',
          });
        }),
      )
      .getManyAndCount();
    return { result, total };
  }

  async findByUser(dto: CommonPaginationDto, accountId: string) {
    const keyword = dto.keyword || '';
    const [result, total] = await this.repo
      .createQueryBuilder('news')
      .select([
        'news.id',
        'news.heading',
        'news.desc',
        'news.image',
        'news.createdAt',
      ])
      .where('news.accountId = :accountId', { accountId: accountId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('news.heading LIKE :keyword OR news.desc LIKE :keyword', {
            keyword: '%' + keyword + '%',
          });
        }),
      )
      .getManyAndCount();
    return { result, total };
  }

  async update(id: string, dto: UpdateNewsDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('News not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('News not found!');
    }
    return this.repo.remove(result);
  }
}
