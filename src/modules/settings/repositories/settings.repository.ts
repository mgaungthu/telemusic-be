import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class SettingsRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  findByKey(key: string) {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async update(key: string, value: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async create(key: string, value: string) {
    return this.prisma.setting.create({
      data: { key, value },
    });
  }
}