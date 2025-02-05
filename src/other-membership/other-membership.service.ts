import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOtherMembershipDto } from './dto/create-other-membership.dto';
import { UpdateOtherMembershipDto } from './dto/update-other-membership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OtherMembership } from './entities/other-membership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OtherMembershipService {
  constructor(
    @InjectRepository(OtherMembership)
    private readonly repo: Repository<OtherMembership>,
  ) {}

  async create(dto: CreateOtherMembershipDto) {
    const result = await this.repo.findOne({
      where: { clubName: dto.clubName },
    });
    if (result) {
      throw new ConflictException('Club already exists!');
    }
    const obj = Object.assign(dto);
    return this.repo.save(obj);
  }

  async remove(id: string) {
    const result = await this.repo.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Club not found!');
    }
    return this.repo.remove(result);
  }
}
