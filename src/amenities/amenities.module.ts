import { Module } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { AmenitiesController } from './amenities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Amenity } from './entities/amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity]), AuthModule],
  controllers: [AmenitiesController],
  providers: [AmenitiesService],
})
export class AmenitiesModule {}
