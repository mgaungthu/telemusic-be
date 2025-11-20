import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';

@Injectable()
export class TrackRepository {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.track.create({
      data,
      include: {
        artist: true,
        album: true,
        featuringArtists: true,
      },
    });
  }

  update(id: bigint, data: any) {
    return this.prisma.track.update({
      where: { id },
      data,
      include: {
        artist: true,
        album: true,
        featuringArtists: true,
      },
    });
  }

  delete(id: bigint) {
    return this.prisma.track.delete({ where: { id } });
  }

  findOne(id: bigint) {
    return this.prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
        featuringArtists: true,
      },
    });
  }

  findByAlbum(albumId: bigint) {
    return this.prisma.track.findMany({
      where: { albumId },
      include: {
        artist: true,
        featuringArtists: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByArtist(artistProfileId: bigint) {
    return this.prisma.track.findMany({
      where: { artistId: artistProfileId },
      include: {
        album: true,
        featuringArtists: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.track.findMany({
      include: {
        artist: true,
        album: true,
        featuringArtists: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}