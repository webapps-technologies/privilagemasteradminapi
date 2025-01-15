import { Module } from '@nestjs/common';
import { ContractTypeService } from './contract-type.service';
import { ContractTypeController } from './contract-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractType } from './entities/contract-type.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContractType]), AuthModule],
  controllers: [ContractTypeController],
  providers: [ContractTypeService],
})
export class ContractTypeModule {}
