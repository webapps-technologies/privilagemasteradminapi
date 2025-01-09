import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Business } from './entities/business.entity';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Business]), AuthModule, NodeMailerModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}