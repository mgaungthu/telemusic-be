import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { StreamsController } from './controllers/streams.controller';
import { StreamsService } from './services/streams.service';
import { StreamRepository } from './repositories/stream.repository';

@Module({
  controllers: [StreamsController],
  providers: [
    StreamsService,
    StreamRepository,
    PrismaService,
  ],
  exports: [StreamsService],
})
export class StreamsModule {}