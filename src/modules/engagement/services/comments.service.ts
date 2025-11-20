import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories/comments.repository';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepo: CommentsRepository,
    private prisma: PrismaService,
  ) {}

  async addComment(userId: bigint, songId: bigint, content: string) {
    // 🔥 1. Validate track existence
    const track = await this.prisma.track.findUnique({
      where: { id: songId },
    });

    if (!track) {
      throw new BadRequestException('Track not found');
    }

    // 🔥 2. Create comment
    const comment = await this.commentsRepo.create(userId, songId, content);

    // 🔥 3. Update comment count
    const count = await this.commentsRepo.count(songId);
    await this.prisma.track.update({
      where: { id: songId },
      data: { commentCount: count },
    });

    return comment;
  }

  getComments(songId: bigint) {
    return this.commentsRepo.findAll(songId);
  }

  // async editComment(commentId: bigint, songId: bigint, content: string) {
  //   const comment = await this.commentsRepo.update(commentId, content);
  //   return { edited: true, comment };
  // }

  async deleteComment(commentId: bigint, songId: bigint) {
    await this.commentsRepo.softDelete(commentId);

    const count = await this.commentsRepo.count(songId);
    await this.prisma.track.update({
      where: { id: songId },
      data: { commentCount: count },
    });

    return { deleted: true };
  }
}