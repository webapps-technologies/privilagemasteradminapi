import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardTncDto } from './dto/create-card-tnc.dto';
import { UpdateCardTncDto } from './dto/update-card-tnc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardTnc } from './entities/card-tnc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardTncService {
  constructor(
    @InjectRepository(CardTnc) private readonly repo: Repository<CardTnc>,
  ) {}

  async create(dto: CreateCardTncDto) {
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async update(id: string, dto: UpdateCardTncDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('T&C not found!!')
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('T&C not found!!')
    }
    return this.repo.remove(result);
  }
}
