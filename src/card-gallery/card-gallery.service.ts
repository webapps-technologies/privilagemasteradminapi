import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardGalleryDto } from './dto/create-card-gallery.dto';
import { UpdateCardGalleryDto } from './dto/update-card-gallery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CardGallery } from './entities/card-gallery.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardGalleryService {
  constructor(
    @InjectRepository(CardGallery)
    private readonly repo: Repository<CardGallery>,
  ) {}

  async create(image: string, membershipCardId: string) {
    const obj = Object.assign({
      image: process.env.PV_CDN_LINK + image,
      imagePath: image,
      membershipCardId: membershipCardId,
    });
    return this.repo.save(obj);
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async image(image: string, result: CardGallery) {
    const obj = Object.assign(result, {
      image: process.env.PV_CDN_LINK + image,
      imagePath: image,
    });
    return this.repo.save(obj);
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Card-Gallery not found!!!');
    }
    return this.repo.remove(result);
  }
}
