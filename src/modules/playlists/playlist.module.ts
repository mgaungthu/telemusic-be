import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { PlaylistController } from './controllers/playlist.controller';
import { PlaylistService } from './services/playlist.service';
import { PlaylistRepository } from './repositories/playlist.repository';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistRepository, PrismaService],
})
export class PlaylistModule {}