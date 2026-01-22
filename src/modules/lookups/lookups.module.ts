import { Module } from '@nestjs/common';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [LookupsController],
  providers: [LookupsService, PrismaService],
  exports: [LookupsService],
})
export class LookupsModule {}