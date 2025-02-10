import { Module } from '@nestjs/common';
import { UserChildService } from './user-child.service';
import { UserChildController } from './user-child.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserChild } from './entities/user-child.entity';
import { UserDetail } from 'src/user-details/entities/user-detail.entity';
import { MembershipCard } from 'src/membership-card/entities/membership-card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserChild, UserDetail, MembershipCard]), AuthModule],
  controllers: [UserChildController],
  providers: [UserChildService],
})
export class UserChildModule {}
