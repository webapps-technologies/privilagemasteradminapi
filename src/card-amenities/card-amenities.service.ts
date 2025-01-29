import { Injectable, NotFoundException } from '@nestjs/common';
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
    const promise = dto.amenitiesId.map(async (item) => {
      const obj = Object.assign({
        membershipCardId: dto.membershipCardId,
        amenitiesId: item,
      });
      return this.repo.save(obj);
    });
    return await Promise.all(promise);
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Card-Amenities not found!!');
    }
    return this.repo.remove(result);
  }
}
