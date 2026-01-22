import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '../services/uploads.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { TracksService } from '@/modules/tracks/services/tracks.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly tracksService: TracksService,
  ) {}

  @Roles('admin', 'artist')
  @Post('audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(
    @UploadedFile() file?: Express.Multer.File,
    @Body('trackId') trackId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    // Basic safety checks
    if (!file.mimetype?.startsWith('audio/')) {
      throw new BadRequestException('Only audio files are allowed');
    }

    if (!trackId) {
      throw new BadRequestException('trackId is required');
    }

    const exists = await this.tracksService.getTrack(BigInt(trackId));
    if (!exists) {
      throw new BadRequestException('Invalid trackId');
    }

    const result = await this.uploadsService.uploadAudioAndQueue(
      file,
      BigInt(trackId),
    );

    // returns queued job response
    return result;
  }
}
