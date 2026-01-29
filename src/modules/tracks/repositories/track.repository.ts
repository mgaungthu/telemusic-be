/**
 * Flexible findMany for tracks with options for orderBy, take, and where.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class TrackRepository {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.track.create({
      data: {
        name: data.name,
        coverImage: data.coverImage ?? null,
        releaseDate: data.releaseDate ?? null,

        // foreign keys ONLY
        artistId: data.artistId,
        albumId: data.albumId,
        genreId: data.genreId,

        // async audio fields (worker will update later)
        audioUrl: '__PROCESSING__',
        duration: 0,

        // optional relations
        featuringArtists: data.featuringArtists,
      },
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
        genre: true,
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

  findByGenre(
    genreId: bigint,
    options?: { orderBy?: any; take?: number }
  ) {
    return this.prisma.track.findMany({
      where: { genreId },
      ...(options?.orderBy && { orderBy: options.orderBy }),
      ...(options?.take && { take: options.take }),
      include: {
        artist: true,
        album: true,
        featuringArtists: true,
      },
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

  findMany(options?: { orderBy?: any; take?: number; where?: any }) {
    return this.prisma.track.findMany({
      ...(options?.where && { where: options.where }),
      ...(options?.orderBy && { orderBy: options.orderBy }),
      ...(options?.take && { take: options.take }),
      include: {
        artist: true,
        album: true,
        featuringArtists: true,
      },
    });
  }

  // Fetch popular playlists for a given genre, sorted by total track streams
    async findPopularPlaylistsByGenre(genreId: bigint) {
    // Fetch playlists with their tracks
    return this.prisma.playlist.findMany({
      where: {
        tracks: {
          some: {
            track: { genreId },
          },
        },
      },
      include: {
        tracks: {
          include: { track: true },
        },
      },
    });
  }

}
