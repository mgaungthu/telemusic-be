import { Body, Controller, Get, Put } from '@nestjs/common';
import { RevenueService } from '../services/revenue.service';
import { RevenueRateDto } from '../dto/revenue-rate.dto';

@Controller('monetization/revenue')
export class RevenueController {
  constructor(private service: RevenueService) {}

  @Get('rate')
  getRate() {
    return this.service.getRate();
  }

  @Put('rate')
  updateRate(@Body() dto: RevenueRateDto) {
    return this.service.updateRate(dto.rate);
  }
}