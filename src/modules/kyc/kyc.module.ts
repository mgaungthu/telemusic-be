import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { KycController } from './controllers/kyc.controller';
import { KycService } from './services/kyc.service';
import { KycRepository } from './repositories/kyc.repository';

@Module({
  controllers: [KycController],
  providers: [KycService, KycRepository, PrismaService],
  exports: [KycService],
})
export class KycModule {}