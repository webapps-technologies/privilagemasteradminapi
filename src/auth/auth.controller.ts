import { Body, Controller, Get, Ip, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AdminSigninDto,
  ForgotPassDto,
  VerifyOtpDto,
} from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  adminLogin(@Body() dto: AdminSigninDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/verify')
  verifyOtp(@Body() dto: VerifyOtpDto, @Ip() ip) {
    return this.authService.verifyOtp(dto, ip);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@CurrentUser() user: Account, @Ip() ip) {
    return this.authService.logout(user.id, ip);
  }

  @Post('resetPass')
  resetPassword(@Body() dto: ForgotPassDto) {
    return this.authService.resetPassword(dto);
  }
}
