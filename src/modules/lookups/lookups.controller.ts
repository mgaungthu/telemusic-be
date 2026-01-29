import {
  Controller,
  Get,
  Query,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LookupsService } from './lookups.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('lookups')
export class LookupsController {
  constructor(private readonly service: LookupsService) {}

  // GET /lookups/genres
  @Get('genres')
  getGenres() {
    return this.service.getGenres();
  }

  // GET /lookups/genres/:id
  @Get('genres/:id')
  getGenre(@Param('id') id: string) {
    return this.service.getGenreById(id);
  }

  // PATCH /lookups/genres/:id

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('genres/:id')
  @UseInterceptors(FileInterceptor('image'))
  updateGenre(
    @Param('id') id: string,
    @Body('name') name?: string,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.updateGenre(id, { name, image });
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
