import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ArtistRepository } from '../../artists/repositories/artist.repository';
import { TrackRepository } from '../repositories/track.repository';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    private artistRepo: ArtistRepository,
    private trackRepo: TrackRepository,
    @InjectQueue('audio-transcode')
    private readonly audioQueue: Queue,
  ) {}

  async createTrack(currentUserId: bigint | null, dto: CreateTrackDto) {
    let artist;

    if (currentUserId) {
      artist = await this.artistRepo.findByUser(currentUserId);
    } else if (dto.userId) {
      artist = await this.artistRepo.findByUser(BigInt(dto.userId));
    }

    if (!artist) throw new ForbiddenException('Artist profile not found');

    const featuringConnect = dto.featuringArtistIds?.length
      ? dto.featuringArtistIds.map((id) => ({ id: BigInt(id) }))
      : undefined;

    return this.trackRepo.create({
      name: dto.name,
      coverImage: dto.coverImage,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
      albumId: dto.albumId ? BigInt(dto.albumId) : undefined,
      genreId: dto.genreId ? BigInt(dto.genreId) : undefined,
      artistId: artist.id,
      featuringArtists: featuringConnect
        ? { connect: featuringConnect }
        : undefined,
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

  getTracksByGenre(genreId: bigint) {
    return this.trackRepo.findByGenre(genreId);
  }

  async updateTrack(id: bigint, dto: UpdateTrackDto) {
    await this.getTrack(id); // ensure track exists

    let featuringSet: { id: bigint }[] | undefined;

    if (dto.featuringArtistIds?.length) {
      // check which artists actually exist
      const existingArtists = await this.artistRepo.findMany({
        id: { in: dto.featuringArtistIds.map((id) => BigInt(id)) },
      });

      if (existingArtists.length !== dto.featuringArtistIds.length) {
        throw new ForbiddenException('One or more featuring artists not found');
      }

      featuringSet = dto.featuringArtistIds.map((id) => ({ id: BigInt(id) }));
    } else if (dto.featuringArtistIds && dto.featuringArtistIds.length === 0) {
      featuringSet = [];
    }

    return this.trackRepo.update(id, {
      name: dto.name,
      audioUrl: dto.audioUrl,
      coverImage: dto.coverImage,
      duration: dto.duration,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : null,
      albumId: dto.albumId ? BigInt(dto.albumId) : undefined,
      genreId: dto.genreId ? BigInt(dto.genreId) : undefined,
      featuringArtists: featuringSet ? { set: featuringSet } : undefined,
    });
  }

  deleteTrack(id: bigint) {
    return this.trackRepo.delete(id);
  }

  findAll() {
    return this.trackRepo.findAll();
  }

  async getTrackProgress(trackId: bigint) {
    const jobs = await this.audioQueue.getJobs(
      ['waiting', 'active', 'completed', 'failed'],
      0,
      50, // look at more jobs to be safe
    );

    // 🔍 find ALL jobs for this track
    const trackJobs = jobs.filter(
      (j) => String(j.data?.trackId) === trackId.toString(),
    );

    console.log(jobs);

    // 💤 no job yet
    if (trackJobs.length === 0) {
      return {
        progress: 0,
        state: 'idle',
      };
    }

    // ✅ BullMQ returns jobs ordered newest → oldest
    const latestJob = trackJobs[0];
    const state = await latestJob.getState();

    return {
      jobId: latestJob.id,
      progress: typeof latestJob.progress === 'number' ? latestJob.progress : 0,
      state,
    };
  }

  async findTop() {
    // Returns top 20 tracks ordered by play count descending
    return this.trackRepo.findMany({
      orderBy: { streamCount: 'desc' },
      take: 20,
    });
  }

  async findNew() {
    // Returns newest 20 tracks ordered by releaseDate descending
    return this.trackRepo.findMany({
      orderBy: { releaseDate: 'desc' },
      take: 20,
    });
  }
}
