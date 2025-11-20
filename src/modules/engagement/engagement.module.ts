import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { LikesRepository } from './repositories/likes.repository';
import { CommentsRepository } from './repositories/comments.repository';
import { SharesRepository } from './repositories/shares.repository';

import { LikesService } from './services/likes.service';
import { CommentsService } from './services/comments.service';
import { SharesService } from './services/shares.service';

import { LikesController } from './controllers/likes.controller';
import { CommentsController } from './controllers/comments.controller';
import { SharesController } from './controllers/shares.controller';

@Module({
  controllers: [
    LikesController,
    CommentsController,
    SharesController,
  ],
  providers: [
    PrismaService,
    LikesRepository,
    CommentsRepository,
    SharesRepository,
    LikesService,
    CommentsService,
    SharesService,
  ],
})
export class EngagementModule {}