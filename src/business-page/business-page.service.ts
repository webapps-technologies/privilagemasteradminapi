import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBusinessPageDto } from './dto/create-business-page.dto';
import { UpdateBusinessPageDto } from './dto/update-business-page.dto';
import { BusinessPage } from './entities/business-page.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BusinessPageService {
  constructor(
    @InjectRepository(BusinessPage)
    private readonly repo: Repository<BusinessPage>,
  ) {}

  async create(dto: CreateBusinessPageDto, accountId: string) {
    const result = await this.repo.findOne({
      where: { name: dto.name, accountId: accountId },
    });
    if (result) {
      throw new ConflictException('Page already exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  findAll() {
    return `This action returns all businessPage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} businessPage`;
  }

  update(id: number, updateBusinessPageDto: UpdateBusinessPageDto) {
    return `This action updates a #${id} businessPage`;
  }

  remove(id: number) {
    return `This action removes a #${id} businessPage`;
  }
}
