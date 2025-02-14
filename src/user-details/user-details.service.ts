import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entities/account.entity';
import { Brackets, Repository } from 'typeorm';
import {
  PaginationSDto,
  UpdateMemberDto,
  UpdateUserDetailDto,
} from './dto/update-user-details';
import { UserDetail } from './entities/user-detail.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { MembershipCard } from 'src/membership-card/entities/membership-card.entity';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(UserDetail) private readonly repo: Repository<UserDetail>,
    @InjectRepository(MembershipCard)
    private readonly memCardRepo: Repository<MembershipCard>,
  ) {}

  async findOne(id: string) {
    const result = await this.repo.findOne({ where: { accountId: id } });
    if (!result) {
      throw new NotFoundException('User not found!');
    }
    return result;
  }

  async update(dto: UpdateUserDetailDto, accountId: string) {
    const result = await this.repo.findOne({ where: { accountId: accountId } });
    if (!result) {
      throw new NotFoundException('User profile not found!');
    }
    const membershipCard = await this.memCardRepo.findOne({
      where: { id: dto.membershipCardId },
    });
    if (!membershipCard) {
      throw new NotFoundException('MembershipCard not found!');
    }
    const today = new Date();
    const startDate = new Date().toLocaleDateString('en-CA');
    const duration = parseInt(membershipCard.validity);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + duration - 1);
    const endDateString = endDate.toLocaleDateString('en-CA');
    const memberId = `MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    const cardNumber = `CRD-${Math.floor(1000 + Math.random() * 9000)}`;

    const obj = Object.assign(result, {
      membershipCardId: dto.membershipCardId,
      salutation: dto.salutation,
      email: dto.email,
      fName: dto.fName,
      mName: dto.mName,
      lName: dto.lName,
      gender: dto.gender,
      address1: dto.address1,
      address2: dto.address2,
      city: dto.city,
      state: dto.state,
      zipcode: dto.zipcode,
      aadharNumber: dto.aadharNumber,
      haveBusiness: dto.haveBusiness,      
      businessType: dto.businessType,
      businessName: dto.businessName,
      gstNumber: dto.gstNumber,
      businessCity: dto.businessCity,
      businessState: dto.businessState,
      businessZipcode: dto.businessZipcode,
      businessPhone: dto.businessPhone,
      businessEmail: dto.businessEmail,
      landMark: dto.landMark,
      businessLandmark: dto.businessLandmark,
      fatherName: dto.fatherName,
      dob: dto.dob,
      qualification: dto.qualification,
      profession: dto.profession,
      panNumber: dto.panNumber,
      income: dto.income,
      businessAddress1: dto.businessAddress1,
      businessAddress2: dto.businessAddress2,
      
      cardNumber: cardNumber,
      membershipValidFrom: startDate,
      membershipValidTo: endDateString,
      memberId: memberId,
    });
    return this.repo.save(obj);
  }

  async updateMember(accountId: string, dto: UpdateMemberDto) {
    const result = await this.repo.findOne({ where: { accountId: accountId } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    const obj = Object.assign(result, dto);
    return this.repo.save(obj);
  }

  async profileImage(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      profile: process.env.PV_CDN_LINK + image,
      profilePath: image,
    });
    return this.repo.save(obj);
  }

  async memberDoc(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      memberDoc: process.env.PV_CDN_LINK + image,
      memberDocPath: image,
    });
    return this.repo.save(obj);
  }

  async businessDoc(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      businessDoc: process.env.PV_CDN_LINK + image,
      businessDocPath: image,
    });
    return this.repo.save(obj);
  }

  async pan(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      pan: process.env.PV_CDN_LINK + image,
      panPath: image,
    });
    return this.repo.save(obj);
  }

  async aadhar(image: string, result: UserDetail) {
    const obj = Object.assign(result, {
      aadhar: process.env.PV_CDN_LINK + image,
      aadharPath: image,
    });
    return this.repo.save(obj);
  }

  async memberStatus(accountId: string, dto: DefaultStatusDto) {
    const result = await this.repo.findOne({ where: { accountId: accountId } });
    if (!result) {
      throw new NotFoundException('Account Not Found With This ID.');
    }
    const obj = Object.assign(result, { status: dto.status });
    return this.repo.save(obj);
  }
}
