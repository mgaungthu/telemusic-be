import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: bigint) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllWithFilters(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string;
    sort?: 'latest' | 'oldest' | 'az' | 'za';
  }) {
    const { page, limit, search, role, status, sort } = params;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    let orderBy: any = { createdAt: 'desc' };

    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'az') orderBy = { name: 'asc' };
    if (sort === 'za') orderBy = { name: 'desc' };

    return this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });
  }

  async countAllWithFilters(params: {
    search?: string;
    role?: string;
    status?: string;
  }) {
    const { search, role, status } = params;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    return this.prisma.user.count({ where });
  }
}
