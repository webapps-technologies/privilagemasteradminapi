import { Module } from '@nestjs/common';
import { BusinessTypeService } from './business-type.service';
import { BusinessTypeController } from './business-type.controller';
import { BusinessType } from './entities/business-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessType]), AuthModule],
  controllers: [BusinessTypeController],
  providers: [BusinessTypeService],
})
export class BusinessTypeModule {}
