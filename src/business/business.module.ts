import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Business } from './entities/business.entity';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';
import { MulterModule } from '@nestjs/platform-express';
import { Account } from 'src/account/entities/account.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { Licence } from 'src/licence/entities/licence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Business, Setting, Licence]),
    AuthModule,
    NodeMailerModule,
    MulterModule.register({ dest: './uploads/BusinessDoc' }),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
