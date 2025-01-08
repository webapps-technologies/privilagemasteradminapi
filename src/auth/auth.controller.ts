import { Body, Controller, Ip, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AdminSigninDto,
  ForgotPassDto,
  VerifyOtpDto,
} from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  adminLogin(@Body() dto: AdminSigninDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/verify')
  verifyOtp(@Body() dto: VerifyOtpDto, @Ip() ip, @Req() req) {
    return this.authService.verifyOtp(dto, ip, req.headers.origin);
  }

  @Post('resetPass')
  resetPassword(@Body() dto: ForgotPassDto) {
    return this.authService.resetPassword(dto);
  }
}
