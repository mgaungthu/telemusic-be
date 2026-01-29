import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TracksService } from '../services/tracks.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { NumericValuePipe } from '@/common/pipes/numeric-value.pipe';
import { SpacesService } from '@/modules/uploads/services/spaces.service';

@Controller('tracks')
export class TracksController {
  constructor(
    private readonly service: TracksService,
    private readonly spacesService: SpacesService,
  ) {}

  @Get()
  getTracks(@Req() req: any) {
    // Accepts ?category=top or ?category=new or default
    const category = req.query?.category;
    if (category === 'top') {
      return this.service.findTop();
    } else if (category === 'new') {
      return this.service.findNew();
    } else {
      return this.service.findAll();
    }
  }

  @Get('genre/:genreId')
  getByGenre(@Param('genreId', NumericValuePipe) genreId: string) {
    return this.service.getTracksByGenre(BigInt(genreId));
  }


  @Get('genre/:genreId/detail')
  getGenreDetail(@Param('genreId') genreId: string) {
    return this.service.getGenreDetail(BigInt(genreId));
  }

  @Get('album/:albumId')
  getByAlbum(@Param('albumId') albumId: bigint) {
    return this.service.getTracksByAlbum(BigInt(albumId));
  }

  @Get('artist/:artistProfileId')
  getByArtist(@Param('artistProfileId') artistProfileId: string) {
    return this.service.getTracksByArtist(BigInt(artistProfileId));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Req() req: any, @Body() dto: CreateTrackDto, @UploadedFile() file?: Express.Multer.File) {
    const currentUserId =
      req.user.role === 'admin' ? null : BigInt(req.user.id);
    const track = await this.service.createTrack(currentUserId, dto);

    if (file) {
      const extension = file.mimetype.split('/')[1];
      const key = `tracks/${track.id}/cover.${extension}`;

      const { key: savedKey } = await this.spacesService.putPublicObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });

      const updatedTrack = await this.service.updateTrack(track.id, {
        coverImage: `${this.spacesService.cdnBase}/${savedKey}`,
      });

      return updatedTrack;
    }

    return track;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
    return this.service.updateTrack(BigInt(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteTrack(BigInt(id));
  }

  @Get(':id')
  getOne(@Param('id', NumericValuePipe) id: string) {
    return this.service.getTrack(BigInt(id));
  }

  @Get(':id/progress')
  async getTrackProgress(@Param('id') id: string) {
    return this.service.getTrackProgress(BigInt(id));
  }
}
