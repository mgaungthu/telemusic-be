import { Injectable, NotFoundException } from '@nestjs/common';
import { StreamRepository } from '../repositories/stream.repository';
import { CreateStreamDto } from '../dto/create-stream.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RevenueService } from '@/modules/monetization/services/revenue.service';

@Injectable()
export class StreamsService {
  constructor(
    private repo: StreamRepository,
    private prisma: PrismaService,
    private revunue: RevenueService
  ) {}

  async addStream(trackId: bigint, userId: bigint, dto: CreateStreamDto) {

    // 1. Validate track exists
    const track = await this.prisma.track.findUnique({
      where: { id: trackId }
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // 2. Create stream entry
    await this.repo.create({
      songId: trackId,
      userId,
      device: dto.device,
      location: dto.location
    });

    // 3. Increment track.streamCount
    await this.prisma.track.update({
      where: { id: trackId },
      data: { streamCount: { increment: 1 } }
    });

    await this.revunue.applyStreamRevenue(BigInt(trackId));
    
    // 4. Increment artist.totalStreams
    await this.prisma.artistProfile.update({
      where: { id: track.artistId },
      data: { totalStreams: { increment: 1 } }
    });

    return { message: 'Stream recorded' };
  }

  getUserStreams(userId: bigint) {
    return this.repo.findByUser(userId);
  }
}