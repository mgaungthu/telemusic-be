import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { RevenueController } from './controllers/revenue.controller';
import { WithdrawalsController } from './controllers/withdrawals.controller';
import { RevenueService } from './services/revenue.service';
import { WithdrawalService } from './services/withdrawal.service';
import { RevenueRepository } from './repositories/revenue.repository';
import { WithdrawalRepository } from './repositories/withdrawal.repository';

@Module({
  controllers: [RevenueController, WithdrawalsController],
  providers: [
    RevenueService,
    WithdrawalService,
    RevenueRepository,
    WithdrawalRepository,
    PrismaService,
  ],
  exports: [RevenueService, WithdrawalService],
})
export class MonetizationModule {}