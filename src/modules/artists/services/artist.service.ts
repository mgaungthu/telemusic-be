import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ArtistRepository } from '../repositories/artist.repository';
import { UpdateArtistDto } from '../dto/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    private repo: ArtistRepository,
    private prisma: PrismaService,
  ) {}

  async getProfile(userId: bigint) {
    const artist = await this.repo.findByUser(userId);
    if (!artist) throw new NotFoundException('Artist profile not found');
    return artist;
  }

  async updateProfile(id: bigint, dto: UpdateArtistDto) {
    return this.repo.update(id, dto);
  }

  async createArtist(userId: bigint, artistName: string) {
    const existing = await this.repo.findByUser(userId);
    if (existing) {
      return existing;
    }

    const artist = await this.repo.create({ userId, artistName });

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'artist' },
    });

    return artist;
  }

  async followArtist(userId: bigint, artistId: bigint) {
    // prevent self-follow (artist following own profile)
    const ownArtist = await this.repo.findByUser(userId);
    if (ownArtist?.id === artistId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    try {
      await this.prisma.$transaction([
        this.prisma.follow.create({
          data: {
            userId,
            artistId,
          },
        }),
        this.prisma.artistProfile.update({
          where: { id: artistId },
          data: {
            followersCount: { increment: 1 },
          },
        }),
      ]);

      return { success: true };
    } catch (e) {
      throw new BadRequestException('Already followed');
    }
  }

  async unfollowArtist(userId: bigint, artistId: bigint) {
    await this.prisma.$transaction([
      this.prisma.follow.delete({
        where: {
          userId_artistId: {
            userId,
            artistId,
          },
        },
      }),
      this.prisma.artistProfile.update({
        where: { id: artistId },
        data: {
          followersCount: { decrement: 1 },
        },
      }),
    ]);

    return { success: true };
  }

  async getFollowers(artistId: bigint) {
    return this.prisma.follow.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            artistProfile: {
              select: {
                id: true,
                artistName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }
}