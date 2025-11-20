import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private analyticsRepo: AnalyticsRepository,
    private prisma: PrismaService,
  ) {}

  async onStream(trackId: bigint) {
    const track = await this.prisma.track.update({
      where: { id: trackId },
      data: { streamCount: { increment: 1 } },
      include: { artist: true },
    });

    // Update artist
    await this.prisma.artistProfile.update({
      where: { id: track.artistId },
      data: { totalStreams: { increment: 1 } },
    });

    // Update daily analytics
    await this.analyticsRepo.incrementDaily(track.artistId, trackId);
  }

  getTopTracks() {
    return this.analyticsRepo.getTopTracks();
  }

  getTopArtists() {
    return this.analyticsRepo.getTopArtists();
  }
}