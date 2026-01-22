import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class AlbumRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      return await this.prisma.album.create({ data });
    } catch (error) {
      
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid artistId: artist does not exist.');
      }
      throw error;
    }
  }

  findById(id: bigint) {
    return this.prisma.album.findUnique({
      where: { id },
            include: {
        artist: {
          select: {
            id: true,
            artistName: true,
          },
        },
                tracks: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.album.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        artist: {
          select: {
            id: true,
            artistName: true,
          },
        },
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    });
  }

  findByArtist(artistId: bigint) {
    return this.prisma.album.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
      include: { genre: true },
    });
  }

  update(id: bigint, data: any) {
    return this.prisma.album.update({
      where: { id },
      data,
    });
  }

  delete(id: bigint) {
    return this.prisma.album.delete({ where: { id } });
  }
}