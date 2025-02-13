import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BusinessPageService } from './business-page.service';
import { CreateBusinessPageDto } from './dto/create-business-page.dto';
import { UpdateBusinessPageDto } from './dto/update-business-page.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';

@Controller('business-page')
export class BusinessPageController {
  constructor(private readonly businessPageService: BusinessPageService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateBusinessPageDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.businessPageService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.businessPageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessPageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessPageDto: UpdateBusinessPageDto,
  ) {
    return this.businessPageService.update(+id, updateBusinessPageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessPageService.remove(+id);
  }
}
