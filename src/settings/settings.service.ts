import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Like, Repository } from 'typeorm';
import { SettingDto, UpdateSettingDto } from './dto/setting.dto';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting) private readonly repo: Repository<Setting>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: SettingDto) {
    const result = await this.repo.findOne({
      where: { accountId: dto.accountId },
    });
    if (result) {
      throw new ConflictException(
        'settings already exists with this accountId!',
      );
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async find(accountId: string) {
    return this.repo
      .createQueryBuilder('setting')
      .where('setting.accountId = :accountId', { accountId: accountId })
      .getOne();
  }

  async findSettingByAdmin() {
    const [result, total] = await this.repo
      .createQueryBuilder('setting')
      .getManyAndCount();
    return { result, total };
  }

  async update(dto: UpdateSettingDto, accountId: string) {
    const result = await this.repo.findOne({ where: { accountId: accountId } });
    if (!result) {
      throw new NotFoundException('Settings Not found!!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
