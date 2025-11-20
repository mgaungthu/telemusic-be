import { Controller, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { SharesService } from '../services/shares.service';


import { ShareTrackDto } from '../dto/share-track.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('engagement/shares')
export class SharesController {
  constructor(private sharesService: SharesService) {}

  @Post(':songId')
  @UseGuards(JwtAuthGuard)
  share(
    @Req() req: any,
    @Param('songId') songId: bigint,
    @Body() dto: ShareTrackDto,
  ) {
    const userId = BigInt(req.user.id);
    return this.sharesService.share(userId, songId, dto.platform);
  }
}