import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private service: AnalyticsService) {}

  @Get('tracks/top')
  getTopTracks() {
    return this.service.getTopTracks();
  }

  @Get('artists/top')
  getTopArtists() {
    return this.service.getTopArtists();
  }
}
