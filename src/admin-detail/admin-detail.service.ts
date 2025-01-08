import { Injectable } from '@nestjs/common';
import { CreateAdminDetailDto } from './dto/create-admin-detail.dto';
import { UpdateAdminDetailDto } from './dto/update-admin-detail.dto';

@Injectable()
export class AdminDetailService {
  create(createAdminDetailDto: CreateAdminDetailDto) {
    return 'This action adds a new adminDetail';
  }

  findAll() {
    return `This action returns all adminDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminDetail`;
  }

  update(id: number, updateAdminDetailDto: UpdateAdminDetailDto) {
    return `This action updates a #${id} adminDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminDetail`;
  }
}
