import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardAmenityDto } from './dto/create-card-amenity.dto';
import { UpdateCardAmenityDto } from './dto/update-card-amenity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardAmenity } from './entities/card-amenity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardAmenitiesService {
  constructor(
    @InjectRepository(CardAmenity)
    private readonly repo: Repository<CardAmenity>,
  ) {}

  async create(dto: CreateCardAmenityDto) {
    const result = await this.repo.findOne({ where: { name: dto.name } });
    if (result) {
      throw new ConflictException('Amenities already exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateCardAmenityDto) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Amenities Not found!');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async icon(image: string, result: CardAmenity) {
    const obj = Object.assign(result, {
      icon: process.env.PV_CDN_LINK + image,
      iconPath: image,
    });
    return this.repo.save(obj);
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Card-Amenities not found!!');
    }
    return this.repo.remove(result);
  }
}
