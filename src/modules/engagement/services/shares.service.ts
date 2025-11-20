import { Injectable } from '@nestjs/common';
import { SharesRepository } from '../repositories/shares.repository';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SharePlatformEnum } from '@/common/enum/share-platform.enum';


@Injectable()
export class SharesService {
  constructor(
    private sharesRepo: SharesRepository,
    private prisma: PrismaService,
  ) {}

  async share(userId: bigint, songId: bigint, platform: SharePlatformEnum) {
    await this.sharesRepo.create(userId, songId, platform);

    const count = await this.sharesRepo.count(songId);

    await this.prisma.track.update({
      where: { id: songId },
      data: { shareCount: count },
    });

    return { shared: true, shareCount: count };
  }
}