import { Controller, Get, Patch, Post, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

import { ArtistService } from '../services/artist.service';
import { UpdateArtistDto } from '../dto/update-artist.dto';


@Controller('artists')
export class ArtistsController {
  constructor(private service: ArtistService) {}

  @Get(':userId')
  getProfile(@Param('userId') userId: string) {
    return this.service.getProfile(BigInt(userId));
  }

  @Patch(':id')
  updateProfile(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    return this.service.updateProfile(BigInt(id), dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @CurrentUser() user,
    @Body() body: { userId?: number; artistName: string }
  ) {
    let finalUserId: bigint;

    // ADMIN: must supply userId
    if (user.role === 'admin') {
      if (!body.userId) {
        throw new BadRequestException('userId is required for admin.');
      }
      finalUserId = BigInt(body.userId);
    }
    // USER / ARTIST: use their own ID
    else {
      finalUserId = BigInt(user.id);

      // block overriding
      if (body.userId) {
        throw new BadRequestException('You cannot specify userId.');
      }
    }

    return this.service.createArtist(finalUserId, body.artistName);
  }
}