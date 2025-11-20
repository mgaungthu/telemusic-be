import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class StreamRepository {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.stream.create({ data });
  }

  findByUser(userId: bigint) {
    return this.prisma.stream.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' }
    });
  }

  countByTrack(trackId: bigint) {
    return this.prisma.stream.count({
      where: { songId: trackId }
    });
  }
}