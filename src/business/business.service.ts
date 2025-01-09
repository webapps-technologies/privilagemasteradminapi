import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreateBusinessDto,
  EmailVerifyDto,
  PhoneVerifyDto,
} from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NodeMailerService } from 'src/node-mailer/node-mailer.service';
import { sendOtp } from 'src/utils/sms.utils';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business) private readonly repo: Repository<Business>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly nodeMailerService: NodeMailerService,
  ) {}

  async sendOTPEmail(dto: EmailVerifyDto) {
    const otp = 7832;
    // const otp = Math.floor(100000 + Math.random() * 9000);
    // this.nodeMailerService.sendOtpInEmailBusiness(dto.email, otp);
    this.cacheManager.set(dto.email, otp, 10 * 60 * 1000); // for 10 mins
    return { message: 'OTP sent to the email!' };
  }

  async verifyEmail(dto: EmailVerifyDto) {
    const storedOtp = await this.cacheManager.get<string>(dto.email);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP Matched!' };
  }

  async sendOTPPhone(dto: PhoneVerifyDto) {
    const otp = 7832;
    // const otp = Math.floor(1000 + Math.random() * 9000);
    // sendOtp(parseInt(dto.phoneNumber), otp);
    this.cacheManager.set(dto.phoneNumber, otp, 10 * 60 * 1000);
    return { message: 'OTP sent to the Phone Number!' };
  }

  async verifyPhone(dto: PhoneVerifyDto) {
    const storedOtp = await this.cacheManager.get<string>(dto.phoneNumber);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP Matched!' };
  }

  create(dto: CreateBusinessDto) {
    return 'This action adds a new business';
  }

  findAll() {
    return `This action returns all business`;
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`;
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
