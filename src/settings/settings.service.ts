import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
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

  async find() {
    return this.repo.createQueryBuilder('setting').getOne();
  }

  async findSettingByAdmin() {
    const [result, total] = await this.repo
      .createQueryBuilder('setting')
      .getManyAndCount();
    return { result, total };
  }

  async findSetting() {
    return this.repo.createQueryBuilder('setting').getOne();
  }

  async update(dto: SettingDto) {
    const result = await this.repo.createQueryBuilder('setting').getOne();
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async logo(image: string, result: Setting) {
    const obj = Object.assign(result, {
      logo: process.env.PV_CDN_LINK + image,
      logoPath: image,
    });
    return this.repo.save(obj);
  }
}
