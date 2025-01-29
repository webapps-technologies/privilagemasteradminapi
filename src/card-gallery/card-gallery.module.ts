import { Module } from '@nestjs/common';
import { CardGalleryService } from './card-gallery.service';
import { CardGalleryController } from './card-gallery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardGallery } from './entities/card-gallery.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardGallery]),
    AuthModule,
    MulterModule.register({ dest: './uploads/CardGallery' }),
  ],
  controllers: [CardGalleryController],
  providers: [CardGalleryService],
})
export class CardGalleryModule {}
