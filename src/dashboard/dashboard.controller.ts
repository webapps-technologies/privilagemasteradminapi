import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('business/count')
  businessCount() {
    return this.dashboardService.businessCount();
  }

  @Get('amcUser')
  amcUsers() {
    return this.dashboardService.amcUsers();
  }

}
