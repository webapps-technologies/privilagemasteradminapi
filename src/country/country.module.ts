import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Country } from './entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country]), AuthModule],
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
