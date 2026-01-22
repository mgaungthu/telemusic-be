import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { NumericValuePipe } from '@/common/pipes/numeric-value.pipe';
import { ArtistId } from '@/common/decorators/artist-id.decorator';

import { AlbumsService } from '../services/albums.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { SpacesService } from '@/modules/uploads/services/spaces.service';

@Controller('albums')
export class AlbumsController {
  constructor(
    private service: AlbumsService,
    private spacesService: SpacesService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() dto: CreateAlbumDto,
    @ArtistId() artistId: bigint,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let finalArtistId = artistId;

    if (req.user.role === 'admin') {
      if (!dto.artistId) {
        throw new BadRequestException('artistId is required for admin.');
      }
      finalArtistId = BigInt(dto.artistId);
    }

    const album = await this.service.createAlbum(dto, finalArtistId);

    if (file) {
      const extension = file.mimetype.split('/')[1];
      const key = `albums/${album.id}/cover.${extension}`;

      const { key: savedKey } = await this.spacesService.putPublicObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });

      await this.service.updateAlbum(album.id, {
        coverImage: `${this.spacesService.cdnBase}/${savedKey}`,
      });

      album.coverImage = `${this.spacesService.cdnBase}/${savedKey}`;
    }

    return album;
  }

  @Get()
  getAll() {
    return this.service.getAllAlbums();
  }

  @Get('artist/:artistId')
  getByArtist(@Param('artistId') artistId: string) {
    return this.service.getArtistAlbums(BigInt(artistId));
  }

  @Get(':id')
  getOne(@Param('id', NumericValuePipe) id: string) {
    return this.service.getAlbum(BigInt(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: string, @Body() dto: UpdateAlbumDto, @UploadedFile() file?: Express.Multer.File) {
    const album = await this.service.updateAlbum(BigInt(id), dto);

    if (file) {
      const extension = file.mimetype.split('/')[1];
      const key = `albums/${album.id}/cover.${extension}`;

      const { key: savedKey } = await this.spacesService.putPublicObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });

      await this.service.updateAlbum(album.id, {
        coverImage: `${this.spacesService.cdnBase}/${savedKey}`,
      });

      album.coverImage = `${this.spacesService.cdnBase}/${savedKey}`;
    }

    return album;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist', 'admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteAlbum(BigInt(id));
  }
}
