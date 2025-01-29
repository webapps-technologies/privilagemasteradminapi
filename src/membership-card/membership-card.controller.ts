import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { MembershipCardService } from './membership-card.service';
import {
  CreateMembershipCardDto,
  MembershipCardPaginationDto,
} from './dto/create-membership-card.dto';
import { UpdateMembershipCardDto } from './dto/update-membership-card.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Controller('membership-card')
export class MembershipCardController {
  constructor(private readonly membershipCardService: MembershipCardService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateMembershipCardDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.membershipCardService.create(dto);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  findAll(
    @Query() dto: MembershipCardPaginationDto,
    @CurrentUser() user: Account,
  ) {
    return this.membershipCardService.findAll(dto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membershipCardService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  update(@Param('id') id: string, @Body() dto: UpdateMembershipCardDto) {
    return this.membershipCardService.update(id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.membershipCardService.status(id, dto);
  }
}
