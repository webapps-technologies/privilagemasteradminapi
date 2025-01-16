import { Module } from '@nestjs/common';
import { BusinessContractService } from './business-contract.service';
import { BusinessContractController } from './business-contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessContract } from './entities/business-contract.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessContract]), AuthModule],
  controllers: [BusinessContractController],
  providers: [BusinessContractService],
})
export class BusinessContractModule {}
