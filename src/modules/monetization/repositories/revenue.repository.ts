import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class RevenueRepository {
  constructor(private prisma: PrismaService) {}

  async getRate() {
    const setting = await this.prisma.setting.findUnique({
      where: { key: 'STREAM_REVENUE_RATE' },
    });

    return setting && setting.value !== null ? parseFloat(setting.value) : 0.003;
  }

  async updateRate(rate: string) {
    return this.prisma.setting.upsert({
      where: { key: 'STREAM_REVENUE_RATE' },
      update: { value: rate },
      create: { key: 'STREAM_REVENUE_RATE', value: rate },
    });
  }
}