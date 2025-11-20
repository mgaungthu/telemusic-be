import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ArtistRepository } from '../../artists/repositories/artist.repository';
import { TrackRepository } from '../repositories/track.repository';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    private artistRepo: ArtistRepository,
    private trackRepo: TrackRepository,
  ) {}

  async createTrack(currentUserId: bigint, dto: CreateTrackDto) {
    const artist = await this.artistRepo.findByUser(currentUserId);
    if (!artist) throw new ForbiddenException('Artist profile not found');

    const featuringConnect =
      dto.featuringArtistIds?.length
        ? dto.featuringArtistIds.map(id => ({ id: BigInt(id) }))
        : undefined;

    return this.trackRepo.create({
      name: dto.name,
      audioUrl: dto.audioUrl,
      coverImage: dto.coverImage,
      duration: dto.duration,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
      albumId: dto.albumId ? BigInt(dto.albumId) : undefined,
      genreId: dto.genreId ? BigInt(dto.genreId) : undefined,
      artistId: artist.id,
      featuringArtists: featuringConnect ? { connect: featuringConnect } : undefined,
    });
  }

  async getTrack(id: bigint) {
    const track = await this.trackRepo.findOne(id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  getTracksByAlbum(albumId: bigint) {
    return this.trackRepo.findByAlbum(albumId);
  }

  getTracksByArtist(artistProfileId: bigint) {
    return this.trackRepo.findByArtist(artistProfileId);
  }

  async updateTrack(id: bigint, dto: UpdateTrackDto) {
    await this.getTrack(id); // ensures exists

    const featuringSet =
      dto.featuringArtistIds?.length
        ? dto.featuringArtistIds.map(id => ({ id: BigInt(id) }))
        : undefined;

    return this.trackRepo.update(id, {
      name: dto.name,
      audioUrl: dto.audioUrl,
      coverImage: dto.coverImage,
      duration: dto.duration,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
      albumId: dto.albumId ? BigInt(dto.albumId) : undefined,
      genreId: dto.genreId ? BigInt(dto.genreId) : undefined,
      featuringArtists: dto.featuringArtistIds
        ? { set: featuringSet ?? [] }
        : undefined,
    });
  }

  deleteTrack(id: bigint) {
    return this.trackRepo.delete(id);
  }

  findAll() {
    return this.trackRepo.findAll();
  }
}