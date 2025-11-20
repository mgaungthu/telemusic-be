import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req, BadRequestException } from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { NumericValuePipe } from '@/common/pipes/numeric-value.pipe';
import { ArtistId } from '@/common/decorators/artist-id.decorator';

import { AlbumsService } from '../services/albums.service';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';



@Controller('albums')
export class AlbumsController {
  constructor(private service: AlbumsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist','admin')
  @Post('create')
  create(@Body() dto: CreateAlbumDto, @ArtistId() artistId: bigint, @Req() req : any) {
    let finalArtistId = artistId;

    if (req.user.role === 'admin') {
      if (!dto.artistId) {
        throw new BadRequestException('artistId is required for admin.');
      }
      finalArtistId = BigInt(dto.artistId);
    }

    return this.service.createAlbum(dto, finalArtistId);
  }

  @Get('artist/:artistId')
  getByArtist(@Param('artistId') artistId: string) {
    return this.service.getArtistAlbums(BigInt(artistId));
  }

  @Get(':id')
  getOne(@Param('id', NumericValuePipe) id: string){
    return this.service.getAlbum(BigInt(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist','admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    return this.service.updateAlbum(BigInt(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist','admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteAlbum(BigInt(id));
  }
}