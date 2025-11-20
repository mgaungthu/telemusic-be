import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { PlaylistService } from '../services/playlist.service';
import { CreatePlaylistDto } from '../dto/create-playlist.dto';
import { UpdatePlaylistDto } from '../dto/update-playlist.dto';
import { AddTrackDto } from '../dto/add-track.dto';

@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistController {
  constructor(private service: PlaylistService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreatePlaylistDto) {
    const userId = BigInt(req.user.id);
    return this.service.create(userId, dto);
  }

  @Get()
  myPlaylists(@Req() req: any) {
    const userId = BigInt(req.user.id);
    return this.service.getMyPlaylists(userId);
  }

  @Get(':id')
  getOne(@Param('id') id: bigint) {
    return this.service.getById(id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: bigint,
    @Body() dto: UpdatePlaylistDto,
  ) {
    const userId = BigInt(req.user.id);
    return this.service.update(userId, id, dto);
  }

  @Delete(':id')
  delete(@Req() req: any, @Param('id') id: bigint) {
    const userId = BigInt(req.user.id);
    return this.service.delete(userId, id);
  }

  @Post(':id/tracks')
  addTrack(
    @Req() req: any,
    @Param('id') playlistId: bigint,
    @Body() dto: AddTrackDto,
  ) {
    const userId = BigInt(req.user.id);
    return this.service.addTrack(userId, playlistId, BigInt(dto.trackId));
  }

  @Delete(':playlistId/tracks/:trackId')
  removeTrack(
    @Req() req: any,
    @Param('playlistId') playlistId: bigint,
    @Param('trackId') trackId: bigint,
  ) {
    const userId = BigInt(req.user.sub);
    return this.service.removeTrack(userId, playlistId, trackId);
  }
}
