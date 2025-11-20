import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { startOfDay } from 'date-fns';

@Injectable()
export class AnalyticsRepository {
  constructor(private prisma: PrismaService) {}

  async incrementDaily(artistId: bigint, trackId: bigint) {
    const today = startOfDay(new Date());

    return this.prisma.analytics.upsert({
      where: {
        artistId_songId_date: {
          artistId,
          songId: trackId,
          date: today,
        },
      },
      update: {
        streamCount: { increment: 1 },
      },
      create: {
        artistId,
        songId: trackId,
        date: today,
        streamCount: 1,
      },
    });
  }

  getTopTracks(limit = 10) {
    return this.prisma.track.findMany({
      orderBy: { streamCount: 'desc' },
      take: limit,
    });
  }

  getTopArtists(limit = 10) {
    return this.prisma.artistProfile.findMany({
      orderBy: { totalStreams: 'desc' },
      take: limit,
    });
  }
}