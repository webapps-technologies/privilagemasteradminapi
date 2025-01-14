import { Injectable } from '@nestjs/common';
import { CreateLicencePlanDto } from './dto/create-licence-plan.dto';
import { UpdateLicencePlanDto } from './dto/update-licence-plan.dto';

@Injectable()
export class LicencePlanService {
  create(createLicencePlanDto: CreateLicencePlanDto) {
    return 'This action adds a new licencePlan';
  }

  findAll() {
    return `This action returns all licencePlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} licencePlan`;
  }

  update(id: number, updateLicencePlanDto: UpdateLicencePlanDto) {
    return `This action updates a #${id} licencePlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} licencePlan`;
  }
}
