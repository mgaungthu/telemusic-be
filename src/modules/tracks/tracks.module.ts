import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { TracksController } from './controllers/tracks.controller';
import { TracksService } from './services/tracks.service';
import { TrackRepository } from './repositories/track.repository';
import { ArtistRepository } from '../artists/repositories/artist.repository';
import { UploadsModule } from '../uploads/uploads.module';
import { AlbumRepository } from '../albums/repositories/album.repository';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio-transcode', // ⭐ MUST MATCH InjectQueue name
    }),
    forwardRef(() => UploadsModule),
  ],
  controllers: [TracksController],
  providers: [
    TracksService,
    TrackRepository,
    ArtistRepository,
    AlbumRepository
  ],
  exports: [TracksService],
})
export class TracksModule {}