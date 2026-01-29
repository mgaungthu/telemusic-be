import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  AdminCreateUserDto,
  AdminUserRole,
  AdminUserStatus,
} from '../dto/admin-create-user.dto';
import { RoleType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AdminUpdateUserDto } from '../dto/admin-update-user.dto';

@Injectable()
export class AdminUsersService {
  constructor(private prisma: PrismaService) {}

  private readonly roleMap: Record<AdminUserRole, RoleType> = {
    [AdminUserRole.ADMIN]: RoleType.admin,
    [AdminUserRole.USER]: RoleType.listener,
    [AdminUserRole.ARTIST]: RoleType.artist,
  };

  async createUser(dto: AdminCreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Create user
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: this.roleMap[dto.role],
          status: dto.status ?? AdminUserStatus.ACTIVE,
        },
      });

      // 2️⃣ Create artist profile if role = artist
      if (dto.role === AdminUserRole.ARTIST) {
        if (!dto.artistName) {
          throw new BadRequestException('Artist info is required');
        }

        await tx.artistProfile.create({
          data: {
            userId: user.id,
            artistName: dto.artistName,
            genreId: dto.genreId,
            countryId: dto.countryId,
            cityId: dto.cityId,
            bio: dto.bio,
          },
        });
      }

      return user;
    });
  }

  // 📄 Get users list (admin)
  async getUsers(filters: { role?: string; status?: string }) {
    return this.prisma.user.findMany({
      where: {
        role: filters.role as any,
        status: filters.status as any,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        artistProfile: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
            country: {
              select: { id: true, name: true },
            },
            city: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  // 🔍 Get single user detail
  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id: BigInt(id) },
      include: {
        artistProfile: {
          include: {
            genre: {
              select: { id: true, name: true },
            },
            country: {
              select: { id: true, name: true },
            },
            city: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });
  }

  // ✏️ Update user (role / status / artist)
  async updateUser(id: bigint, data: Partial<AdminUpdateUserDto>) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: BigInt(id) },
        data: {
          name: data.name,
          role: data.role ? this.roleMap[data.role as AdminUserRole] : undefined,
          status: data.status ?? undefined,
        },
      });

      // Handle artist profile
      if (data.role === AdminUserRole.ARTIST && data.artistName) {
        // Log artist update info
        console.log('Updating artist profile:', {
          artistName: data.artistName,
          genreId: data.genreId,
          countryId: data.countryId,
          cityId: data.cityId,
          bio: data.bio,
          avatar: data.avatar,
        });

        await tx.artistProfile.upsert({
          where: { userId: user.id },
          update: {
            artistName: data.artistName ?? '',
            genreId: data.genreId ?? null,
            countryId: data.countryId ?? null,
            cityId: data.cityId ?? null,
            bio: data.bio ?? '',
            avatar: data.avatar ?? undefined,
          },
          create: {
            userId: user.id,
            artistName: data.artistName ?? '',
            genreId: data.genreId ?? null,
            countryId: data.countryId ?? null,
            cityId: data.cityId ?? null,
            bio: data.bio ?? '',
            avatar: data.avatar ?? undefined,
          },
        });

      }

      // 🗑️ Remove artist profile if user is no longer an artist
      if (data.role && data.role !== AdminUserRole.ARTIST) {
        const artistProfile = await tx.artistProfile.findUnique({
          where: { userId: user.id },
          select: { id: true },
        });

        if (artistProfile) {
          // Check dependent records (tracks, albums, etc.)
          const hasDependencies = await tx.track.findFirst({
            where: { artistId: artistProfile.id },
            select: { id: true },
          });

          if (hasDependencies) {
            throw new BadRequestException(
              'Cannot remove artist role while artist has existing tracks or albums',
            );
          }

         await tx.artistProfile.update({
            where: { id: artistProfile.id },
            data: {
              kycStatus: 'pending',
            },
          });
        }
      }

      

      return user;
    });
  }
}