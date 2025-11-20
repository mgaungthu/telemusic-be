import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class WithdrawalRepository {
  constructor(private prisma: PrismaService) {}

  create(artistId: bigint, amount: number, gateway: any) {
    return this.prisma.withdrawal.create({
      data: {
        artistId,
        amount,
        paymentGateway: gateway,
      },
    });
  }

  getByArtist(artistId: bigint) {
    return this.prisma.withdrawal.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
    });
  }

  approve(id: bigint, transactionId: string) {
    return this.prisma.withdrawal.update({
      where: { id },
      data: {
        status: 'completed',
        transactionId,
      },
    });
  }

  reject(id: bigint) {
    return this.prisma.withdrawal.update({
      where: { id },
      data: {
        status: 'failed',
      },
    });
  }
}