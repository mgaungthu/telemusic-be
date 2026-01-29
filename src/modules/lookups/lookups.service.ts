import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SpacesService } from '@/modules/uploads/services/spaces.service';

@Injectable()
export class LookupsService {
  constructor(
    private prisma: PrismaService,
    private spacesService: SpacesService,
  ) {}

  // 🎵 Genres
  getGenres() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Get single genre by id
  async getGenreById(id: string) {
    return this.prisma.genre.findUnique({
      where: { id: BigInt(id) },
    });
  }

  // Update a genre (name and/or image)
  async updateGenre(
    id: string,
    payload: { name?: string; image?: Express.Multer.File }
  ) {
    const genre = await this.prisma.genre.findUnique({
      where: { id: BigInt(id) },
    });

    if (!genre) {
      throw new Error('Genre not found');
    }

    const updateData: any = {};

    if (payload.name) {
      updateData.name = payload.name;
    }

    if (payload.image) {
      const extension = payload.image.mimetype.split('/')[1];
      const key = `genres/${id}/cover.${extension}`;

      const { key: savedKey } = await this.spacesService.putPublicObject({
        key,
        body: payload.image.buffer,
        contentType: payload.image.mimetype,
      });

      updateData.image = `${this.spacesService.cdnBase}/${savedKey}`;
    }

    return this.prisma.genre.update({
      where: { id: BigInt(id) },
      data: updateData,
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