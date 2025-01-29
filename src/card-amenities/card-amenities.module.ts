import { Module } from '@nestjs/common';
import { CardAmenitiesService } from './card-amenities.service';
import { CardAmenitiesController } from './card-amenities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CardAmenity } from './entities/card-amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardAmenity]), AuthModule],
  controllers: [CardAmenitiesController],
  providers: [CardAmenitiesService],
})
export class CardAmenitiesModule {}
