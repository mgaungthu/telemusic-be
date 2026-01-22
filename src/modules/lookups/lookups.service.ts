import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LookupsService {
  constructor(private prisma: PrismaService) {}

  // 🎵 Genres
  getGenres() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // 🌍 Countries
  getCountries() {
    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // 🏙 Cities (optional filter by country)
  getCities(countryId?: string) {
    return this.prisma.city.findMany({
      where: countryId ? { countryId: BigInt(countryId) } : undefined,
      orderBy: { name: 'asc' },
    });
  }
}