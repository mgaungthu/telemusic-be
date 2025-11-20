import { Module } from '@nestjs/common';
import { ArtistsController } from './controllers/artists.controller';
import { ArtistService } from './services/artist.service';
import { ArtistRepository } from './repositories/artist.repository';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistService, ArtistRepository, PrismaService],
})
export class ArtistsModule {}