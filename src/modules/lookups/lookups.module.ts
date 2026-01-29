import { Module } from '@nestjs/common';
import { LookupsController } from './lookups.controller';
import { LookupsService } from './lookups.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  controllers: [LookupsController],
  providers: [LookupsService, PrismaService],
  exports: [LookupsService],
})
export class LookupsModule {}
