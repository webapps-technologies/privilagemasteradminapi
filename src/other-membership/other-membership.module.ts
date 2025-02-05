import { Module } from '@nestjs/common';
import { OtherMembershipService } from './other-membership.service';
import { OtherMembershipController } from './other-membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OtherMembership } from './entities/other-membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OtherMembership]), AuthModule],
  controllers: [OtherMembershipController],
  providers: [OtherMembershipService],
})
export class OtherMembershipModule {}
