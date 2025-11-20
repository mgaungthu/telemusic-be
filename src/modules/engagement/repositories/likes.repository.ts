import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LikesRepository {
  constructor(private prisma: PrismaService) {}

  findOne(userId: bigint, songId: bigint) {
    return this.prisma.like.findUnique({
      where: { songId_userId: { songId, userId } },
    });
  }

  create(userId: bigint, songId: bigint) {
    return this.prisma.like.create({
      data: { userId, songId },
    });
  }

  delete(userId: bigint, songId: bigint) {
    return this.prisma.like.delete({
      where: { songId_userId: { songId, userId } },
    });
  }

  count(songId: bigint) {
    return this.prisma.like.count({
      where: { songId },
    });
  }
}