import { Injectable, NotFoundException } from '@nestjs/common';
import { ArtistRepository } from '../repositories/artist.repository';
import { UpdateArtistDto } from '../dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private repo: ArtistRepository) {}

  async getProfile(userId: bigint) {
    const artist = await this.repo.findByUser(userId);
    if (!artist) throw new NotFoundException('Artist profile not found');
    return artist;
  }

  async updateProfile(id: bigint, dto: UpdateArtistDto) {
    return this.repo.update(id, dto);
  }

  async createArtist(userId: bigint, artistName: string) {
    return this.repo.create({ userId, artistName });
  }
}