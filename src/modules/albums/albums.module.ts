import { Module } from '@nestjs/common';
import { AlbumsController } from './controllers/albums.controller';
import { AlbumsService } from './services/albums.service';
import { AlbumRepository } from './repositories/album.repository';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, AlbumRepository, PrismaService],
  exports: [AlbumsService],
})
export class AlbumsModule {}