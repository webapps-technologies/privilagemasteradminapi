import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Business } from 'src/business/entities/business.entity';
import { Licence } from 'src/licence/entities/licence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, Licence])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
