import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CompanyDetailsModule } from './company-details/company-details.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MenusModule } from './menus/menus.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PagesModule } from './pages/pages.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SettingsModule } from './settings/settings.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserPermissionsModule } from './user-permissions/user-permissions.module';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { StaffDetailsModule } from './staff-details/staff-details.module';
import { AdminDetailModule } from './admin-detail/admin-detail.module';
import { LoginHistoryModule } from './login-history/login-history.module';
import { BusinessModule } from './business/business.module';
import { BusinessTypeModule } from './business-type/business-type.module';
import { CityModule } from './city/city.module';
import { StateModule } from './state/state.module';
import { CountryModule } from './country/country.module';
import { PlanModule } from './plan/plan.module';
import { MembershipModule } from './membership/membership.module';
import { LicenceModule } from './licence/licence.module';
import { LicencePlanModule } from './licence-plan/licence-plan.module';
import { ContractTypeModule } from './contract-type/contract-type.module';
import { ContractModule } from './contract/contract.module';
import { BusinessContractModule } from './business-contract/business-contract.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Path to your uploads directory
      serveRoot: '/uploads', // The URL path to access the files
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.PV_DB_HOST,
      port: Number(process.env.PV_DB_PORT),
      username: process.env.PV_USER_NAME,
      password: process.env.PV_DB_PASS,
      database: process.env.PV_DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    AuthModule,
    AccountModule,
    DashboardModule,
    SettingsModule,
    MenusModule,
    NotificationsModule,
    PermissionsModule,
    UserPermissionsModule,
    UserDetailsModule,
    CompanyDetailsModule,
    PagesModule,
    NodeMailerModule,
    StaffDetailsModule,
    AdminDetailModule,
    LoginHistoryModule,
    BusinessModule,
    BusinessTypeModule,
    CityModule,
    StateModule,
    CountryModule,
    PlanModule,
    MembershipModule,
    LicenceModule,
    LicencePlanModule,
    ContractTypeModule,
    ContractModule,
    BusinessContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
