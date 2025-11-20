import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ArtistRepository {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: bigint) {
    try {
      return await this.prisma.artistProfile.findUnique({ where: { userId } });
    } catch (error) {
      throw new BadRequestException('Failed to fetch artist profile.');
    }
  }

  async update(id: bigint, data: any) {
    try {
      return await this.prisma.artistProfile.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Artist not found.');
      }
      throw new BadRequestException('Failed to update artist profile.');
    }
  }

  async create(data: any) {
    try {
      return await this.prisma.artistProfile.create({ data });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Artist profile already exists for this user.');
      }
      throw new BadRequestException('Failed to create artist profile.');
    }
  }
}