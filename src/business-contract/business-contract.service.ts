import { Injectable } from '@nestjs/common';
import { CreateBusinessContractDto } from './dto/create-business-contract.dto';
import { UpdateBusinessContractDto } from './dto/update-business-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessContract } from './entities/business-contract.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusinessContractService {
  constructor(
    @InjectRepository(BusinessContract)
    private readonly repo: Repository<BusinessContract>,
  ) {}

  async create(dto: CreateBusinessContractDto) {
    const promise = dto.contractId.map(async (item) => {
      const obj = Object.assign({
        accountId: dto.accountId,
        contractId: item,
      });
      return this.repo.save(obj);
    });
    return await Promise.all(promise);
  }
}
