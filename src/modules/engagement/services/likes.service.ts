import { BadRequestException, Injectable } from '@nestjs/common';
import { LikesRepository } from '../repositories/likes.repository';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(
    private likesRepo: LikesRepository,
    private prisma: PrismaService,
  ) {}

  async likeTrack(userId: bigint, songId: bigint) {
    // 🔥 1. Validate track exists
    const track = await this.prisma.track.findUnique({
      where: { id: songId },
    });

    if (!track) {
      throw new BadRequestException('Track not found');
    }

    // 🔥 2. Create like
    const like = await this.likesRepo.create(userId, songId);

    // 🔥 3. Update like count
    const count = await this.likesRepo.count(songId);
    await this.prisma.track.update({
      where: { id: songId },
      data: { likeCount: count },
    });

    return { liked: true };
  }
}
