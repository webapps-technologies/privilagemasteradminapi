import { Module } from '@nestjs/common';
import { MembershipCardService } from './membership-card.service';
import { MembershipCardController } from './membership-card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipCard } from './entities/membership-card.entity';
import { Business } from 'src/business/entities/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipCard, Business]), AuthModule],
  controllers: [MembershipCardController],
  providers: [MembershipCardService],
})
export class MembershipCardModule {}
