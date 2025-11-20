import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class PlaylistRepository {
  constructor(private prisma: PrismaService) {}

  create(userId: bigint, data: any) {
    return this.prisma.playlist.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  findAllByUser(userId: bigint) {
    return this.prisma.playlist.findMany({
      where: { userId },
      include: {
        tracks: {
          include: { track: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  findOne(id: bigint) {
    return this.prisma.playlist.findUnique({
      where: { id },
      include: {
        tracks: {
          include: { track: true },
          orderBy: { position: 'asc' },
        },
      },
    });
  }

  update(id: bigint, data: any) {
    return this.prisma.playlist.update({
      where: { id },
      data,
    });
  }

  delete(id: bigint) {
    return this.prisma.playlist.delete({
      where: { id },
    });
  }

  addTrack(playlistId: bigint, trackId: bigint) {
    return this.prisma.playlistTrack.create({
      data: {
        playlistId,
        trackId,
      },
    });
  }

  removeTrack(playlistId: bigint, trackId: bigint) {
    return this.prisma.playlistTrack.delete({
      where: {
        playlistId_trackId: {
          playlistId,
          trackId,
        },
      },
    });
  }
}