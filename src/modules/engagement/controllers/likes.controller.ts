import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from '../services/likes.service';


import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('engagement/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post(':songId')
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @Req() req: any,
    @Param('songId') songId: bigint,
  ) {
    const userId = BigInt(req.user.id);
    return this.likesService.likeTrack(userId, songId);
  }
}