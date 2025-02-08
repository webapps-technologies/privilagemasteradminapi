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
import { UserChildService } from './user-child.service';
import { CreateUserChildDto } from './dto/create-user-child.dto';
import { UpdateUserChildDto } from './dto/update-user-child.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';

@Controller('user-child')
export class UserChildController {
  constructor(private readonly userChildService: UserChildService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateUserChildDto) {
    return this.userChildService.create(dto);
  }

  @Get()
  findAll() {
    return this.userChildService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userChildService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserChildDto: UpdateUserChildDto,
  ) {
    return this.userChildService.update(id, updateUserChildDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userChildService.remove(id);
  }
}
