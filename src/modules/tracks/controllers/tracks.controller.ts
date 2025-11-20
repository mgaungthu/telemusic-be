import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TracksService } from '../services/tracks.service';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { NumericValuePipe } from '@/common/pipes/numeric-value.pipe';

@Controller('tracks')
export class TracksController {
  constructor(private readonly service: TracksService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  @Post('create')
  create(@Req() req: any, @Body() dto: CreateTrackDto) {
    const currentUserId = BigInt(req.user.id);
    return this.service.createTrack(currentUserId, dto);
  }

  @Get('album/:albumId')
  getByAlbum(@Param('albumId') albumId: string) {
    return this.service.getTracksByAlbum(BigInt(albumId));
  }

  @Get('artist/:artistProfileId')
  getByArtist(@Param('artistProfileId') artistProfileId: string) {
    return this.service.getTracksByArtist(BigInt(artistProfileId));
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
}
