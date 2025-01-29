import { Module } from '@nestjs/common';
import { CardTncService } from './card-tnc.service';
import { CardTncController } from './card-tnc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CardTnc } from './entities/card-tnc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardTnc]), AuthModule],
  controllers: [CardTncController],
  providers: [CardTncService],
})
export class CardTncModule {}
