import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(private prisma: PrismaService) {}

  create(userId: bigint, songId: bigint, content: string) {
    return this.prisma.comment.create({
      data: { userId, songId, content },
    });
  }

  // update(commentId: bigint, content: string) {
  //   return this.prisma.comment.update({
  //     where: { id: commentId },
  //     data: { content, isEdited: true },
  //   });
  // }

  softDelete(commentId: bigint) {
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    });
  }

  findAll(songId: bigint) {
    return this.prisma.comment.findMany({
      where: { songId, isDeleted: false },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  count(songId: bigint) {
    return this.prisma.comment.count({
      where: { songId, isDeleted: false },
    });
  }
}