import { Module } from '@nestjs/common';
import { LicenceService } from './licence.service';
import { LicenceController } from './licence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Licence } from './entities/licence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Licence]), AuthModule],
  controllers: [LicenceController],
  providers: [LicenceService],
})
export class LicenceModule {}
