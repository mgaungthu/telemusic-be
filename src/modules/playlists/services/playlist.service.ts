import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PlaylistRepository } from '../repositories/playlist.repository';

@Injectable()
export class PlaylistService {
  constructor(private repo: PlaylistRepository) {}

  async create(userId: bigint, dto: any) {
    return this.repo.create(userId, dto);
  }

  async getMyPlaylists(userId: bigint) {
    return this.repo.findAllByUser(userId);
  }

  async getById(id: bigint) {
    const playlist = await this.repo.findOne(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async update(userId: bigint, id: bigint, dto: any) {
    const playlist = await this.repo.findOne(id);
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    return this.repo.update(id, dto);
  }

  async delete(userId: bigint, id: bigint) {
    const playlist = await this.repo.findOne(id);
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    return this.repo.delete(id);
  }

  async addTrack(userId: bigint, playlistId: bigint, trackId: bigint) {
    const playlist = await this.repo.findOne(playlistId);
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    return this.repo.addTrack(playlistId, trackId);
  }

  async removeTrack(userId: bigint, playlistId: bigint, trackId: bigint) {
    const playlist = await this.repo.findOne(playlistId);
    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.userId !== userId) {
      throw new ForbiddenException('Not your playlist');
    }

    return this.repo.removeTrack(playlistId, trackId);
  }
}