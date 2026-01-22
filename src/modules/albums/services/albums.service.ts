import { Injectable, NotFoundException } from '@nestjs/common';
import { AlbumRepository } from '../repositories/album.repository';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private repo: AlbumRepository) {}

  createAlbum(dto: CreateAlbumDto,  artistId: bigint) {
    
    return this.repo.create({
      artistId: dto.artistId || artistId,
      genreId: dto.genreId,
      name: dto.name,
      coverImage: dto.coverImage,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
      description: dto.description,
    });
  }

  async getAllAlbums() {
    return this.repo.findAll();
  }

  async getAlbum(id: bigint) {
    const album = await this.repo.findById(id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  getArtistAlbums(artistId: bigint) {
    return this.repo.findByArtist(artistId);
  }

  async updateAlbum(id: bigint, dto: UpdateAlbumDto) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Album not found');

    return this.repo.update(id, {
      ...dto,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : undefined,
    });
  }

  async deleteAlbum(id: bigint) {
    const exists = await this.repo.findById(id);
    if (!exists) throw new NotFoundException('Album not found');

    return this.repo.delete(id);
  }
}