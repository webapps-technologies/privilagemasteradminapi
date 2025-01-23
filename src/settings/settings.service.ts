import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Like, Repository } from 'typeorm';
import { SettingDto } from './dto/setting.dto';
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

  async find() {
    return this.repo.createQueryBuilder('setting').getOne();
  }

  async findSettingByAdmin() {
    const [result, total] = await this.repo
      .createQueryBuilder('setting')
      .getManyAndCount();
    return { result, total };
  }

  async update(dto: SettingDto) {
    const result = await this.repo.createQueryBuilder('setting').getOne();
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }
}
