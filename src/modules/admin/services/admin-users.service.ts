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
        if (!dto.artist) {
          throw new BadRequestException('Artist info is required');
        }

        await tx.artistProfile.create({
          data: {
            userId: user.id,
            artistName: dto.artist.artistName,
            genreId: dto.artist.genreId,
            countryId: dto.artist.countryId,
            cityId: dto.artist.cityId,
            bio: dto.artist.bio,
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
  async updateUser(id: string, data: Partial<AdminCreateUserDto>) {
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
      if (data.role === AdminUserRole.ARTIST && data.artist) {
        await tx.artistProfile.upsert({
          where: { userId: user.id },
          update: {
            artistName: data.artist.artistName,
            genreId: data.artist.genreId,
            countryId: data.artist.countryId,
            cityId: data.artist.cityId,
            bio: data.artist.bio,
          },
          create: {
            userId: user.id,
            artistName: data.artist.artistName,
            genreId: data.artist.genreId,
            countryId: data.artist.countryId,
            cityId: data.artist.cityId,
            bio: data.artist.bio,
          },
        });
      }

      return user;
    });
  }
}