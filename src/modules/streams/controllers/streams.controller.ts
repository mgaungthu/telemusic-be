import { Controller, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { StreamsService } from '../services/streams.service';
import { CreateStreamDto } from '../dto/create-stream.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('streams')
export class StreamsController {
  constructor(private readonly service: StreamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('track/:id')
  addStream(
    @Param('id') id: string,
    @Body() dto: CreateStreamDto,
    @Req() req
  ) {
    const userId = BigInt(req.user.id);
    return this.service.addStream(BigInt(id), userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('user/history')
  getHistory(@Req() req) {
    return this.service.getUserStreams(BigInt(req.user.id));
  }
}