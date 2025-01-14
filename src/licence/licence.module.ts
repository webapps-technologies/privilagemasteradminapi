import { Module } from '@nestjs/common';
import { LicenceService } from './licence.service';
import { LicenceController } from './licence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Licence } from './entities/licence.entity';
import { LicencePlan } from 'src/licence-plan/entities/licence-plan.entity';
import { Business } from 'src/business/entities/business.entity';
import { Plan } from 'src/plan/entities/plan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Licence, LicencePlan, Business, Plan]),
    AuthModule,
  ],
  controllers: [LicenceController],
  providers: [LicenceService],
})
export class LicenceModule {}
