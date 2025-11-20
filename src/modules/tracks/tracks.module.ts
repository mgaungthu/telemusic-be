import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { TracksController } from './controllers/tracks.controller';
import { TracksService } from './services/tracks.service';
import { TrackRepository } from './repositories/track.repository';
import { ArtistRepository } from '../artists/repositories/artist.repository';

@Module({
  controllers: [TracksController],
  providers: [TracksService, TrackRepository, ArtistRepository, PrismaService],
})
export class TracksModule {}