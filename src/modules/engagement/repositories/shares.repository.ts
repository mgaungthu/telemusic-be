import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SharePlatformEnum } from '@/common/enum/share-platform.enum';


@Injectable()
export class SharesRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: bigint, songId: bigint, platform: SharePlatformEnum) {
    const track = await this.prisma.track.findUnique({
      where: { id: songId },
    });

    if (!track) {
      throw new BadRequestException('Track not found');
    }
    return this.prisma.share.create({
      data: { userId, songId, platform },
    });
  }

  count(songId: bigint) {
    return this.prisma.share.count({
      where: { songId },
    });
  }
}