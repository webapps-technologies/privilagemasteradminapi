import { Module } from '@nestjs/common';
import { LicencePlanService } from './licence-plan.service';
import { LicencePlanController } from './licence-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LicencePlan } from './entities/licence-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LicencePlan]), AuthModule],
  controllers: [LicencePlanController],
  providers: [LicencePlanService],
})
export class LicencePlanModule {}
