import { Module } from '@nestjs/common';
import { BusinessPageService } from './business-page.service';
import { BusinessPageController } from './business-page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessPage } from './entities/business-page.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPage]), AuthModule],
  controllers: [BusinessPageController],
  providers: [BusinessPageService],
})
export class BusinessPageModule {}
