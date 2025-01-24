import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Tax } from './entities/tax.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tax]), AuthModule],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
