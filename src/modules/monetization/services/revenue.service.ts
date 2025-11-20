import { Injectable } from '@nestjs/common';
import { RevenueRepository } from '../repositories/revenue.repository';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class RevenueService {
  constructor(
    private revenueRepo: RevenueRepository,
    private prisma: PrismaService,
  ) {}

  async applyStreamRevenue(trackId: bigint) {
    const rate = await this.revenueRepo.getRate();

    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
      include: { artist: true },
    });

    if (!track) return;

    // Add revenue to artist balance
    await this.prisma.artistProfile.update({
      where: { id: track.artistId },
      data: {
        balance: { increment: rate },
      },
    });
  }

  updateRate(rate: string) {
    return this.revenueRepo.updateRate(rate);
  }

  getRate() {
    return this.revenueRepo.getRate();
  }
}