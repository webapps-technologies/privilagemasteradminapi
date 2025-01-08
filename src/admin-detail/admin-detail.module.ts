import { Module } from '@nestjs/common';
import { AdminDetailService } from './admin-detail.service';
import { AdminDetailController } from './admin-detail.controller';

@Module({
  controllers: [AdminDetailController],
  providers: [AdminDetailService],
})
export class AdminDetailModule {}
