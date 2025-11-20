import { Injectable, BadRequestException } from '@nestjs/common';
import { WithdrawalRepository } from '../repositories/withdrawal.repository';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class WithdrawalService {
  constructor(
    private repo: WithdrawalRepository,
    private prisma: PrismaService,
  ) {}

  async requestWithdrawal(artistId: bigint, amount: number, gateway: any) {
    // Check artist balance
    const artist = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
    });

    if (!artist || Number(artist.balance) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Reduce balance
    await this.prisma.artistProfile.update({
      where: { id: artistId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Create withdrawal record
    return this.repo.create(artistId, amount, gateway);
  }

  getMyWithdrawals(artistId: bigint) {
    return this.repo.getByArtist(artistId);
  }

  approve(id: bigint, transactionId: string) {
    return this.repo.approve(id, transactionId);
  }

  reject(id: bigint) {
    return this.repo.reject(id);
  }
}