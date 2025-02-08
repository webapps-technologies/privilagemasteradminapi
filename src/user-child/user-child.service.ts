import { Injectable } from '@nestjs/common';
import { CreateUserChildDto } from './dto/create-user-child.dto';
import { UpdateUserChildDto } from './dto/update-user-child.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChild } from './entities/user-child.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserChildService {
  constructor(
    @InjectRepository(UserChild) private readonly repo: Repository<UserChild>,
  ) {}

  async create(dto: CreateUserChildDto) {
    //check memberCount of membershipCard if exceed then show error msg.
  }

  findAll() {
    return `This action returns all userChild`;
  }

  findOne(id: string) {
    return `This action returns a #${id} userChild`;
  }

  update(id: string, dto: UpdateUserChildDto) {
    return `This action updates a #${id} userChild`;
  }

  remove(id: string) {
    return `This action removes a #${id} userChild`;
  }
}
