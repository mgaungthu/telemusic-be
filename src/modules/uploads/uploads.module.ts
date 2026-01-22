import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { UploadsController } from './controllers/uploads.controller';
import { UploadsService } from './services/uploads.service';
import { SpacesService } from './services/spaces.service';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    TracksModule,
    // Memory storage: we upload buffer directly to Spaces (no permanent disk)
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, SpacesService],
  exports: [UploadsService, SpacesService],
})
export class UploadsModule {}