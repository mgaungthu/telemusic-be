import { Controller, Get, Query } from '@nestjs/common';
import { LookupsService } from './lookups.service';

@Controller('lookups')
export class LookupsController {
  constructor(private readonly service: LookupsService) {}

  // GET /lookups/genres
  @Get('genres')
  getGenres() {
    return this.service.getGenres();
  }

  // GET /lookups/countries
  @Get('countries')
  getCountries() {
    return this.service.getCountries();
  }

  // GET /lookups/cities?country_id=1
  @Get('cities')
  getCities(@Query('country_id') countryId?: string) {
    return this.service.getCities(countryId);
  }
}