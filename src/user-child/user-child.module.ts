import { Module } from '@nestjs/common';
import { UserChildService } from './user-child.service';
import { UserChildController } from './user-child.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserChild } from './entities/user-child.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserChild]), AuthModule],
  controllers: [UserChildController],
  providers: [UserChildService],
})
export class UserChildModule {}
