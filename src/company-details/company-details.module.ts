import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CompanyDetailsController } from './company-details.controller';
import { CompanyDetailsService } from './company-details.service';
import { CompanyDetail } from './entities/company-detail.entity';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyDetail]),
    AuthModule,
    NodeMailerModule,
    MulterModule.register({ dest: './uploads/companyDetail' }),
  ],
  controllers: [CompanyDetailsController],
  providers: [CompanyDetailsService],
  exports: [CompanyDetailsService],
})
export class CompanyDetailsModule {}
