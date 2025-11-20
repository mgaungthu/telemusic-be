import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';
import { WithdrawalService } from '../services/withdrawal.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('monetization/withdrawals')
export class WithdrawalsController {
  constructor(private service: WithdrawalService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  request(@Req() req, @Body() dto: CreateWithdrawalDto) {
    const artistId = BigInt(req.user.artistId); // You already store artist profile
    return this.service.requestWithdrawal(artistId, dto.amount, dto.gateway);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  myWithdrawals(@Req() req) {
    const artistId = BigInt(req.user.artistId);
    return this.service.getMyWithdrawals(artistId);
  }

  // Admin only
  @Put(':id/approve')
  approve(@Param('id') id: string, @Body('transactionId') tx: string) {
    return this.service.approve(BigInt(id), tx);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(BigInt(id));
  }
}