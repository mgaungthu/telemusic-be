import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { KycService } from '../services/kyc.service';
import { CreateKycDto } from '../dto/create-kyc.dto';
import { ReviewKycDto } from '../dto/review-kyc.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('kyc')
export class KycController {
  constructor(private service: KycService) {}

  // USER: Submit KYC
  @UseGuards(JwtAuthGuard)
  @Post('submit')
  submit(@Req() req, @Body() dto: CreateKycDto) {
    const artistId = BigInt(req.user.artistId);
    return this.service.submit(artistId, dto.documentType, dto.documentUrl);
  }

  // USER: My submissions
  @UseGuards(JwtAuthGuard)
  @Get('my')
  mySubmissions(@Req() req) {
    const artistId = BigInt(req.user.artistId);
    return this.service.mySubmissions(artistId);
  }

  // ADMIN: Pending KYC
  @Get('pending')
  allPending() {
    return this.service.allPending();
  }

  // ADMIN: Approve / Reject
  @Put('review/:id')
  review(@Param('id') id: string, @Body() dto: ReviewKycDto) {
    return this.service.review(BigInt(id), dto.status, dto.remarks);
  }
}