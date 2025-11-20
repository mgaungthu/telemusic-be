import { Injectable, BadRequestException } from '@nestjs/common';
import { KycRepository } from '../repositories/kyc.repository';
import { PrismaService } from '@/common/prisma/prisma.service';
import { KycStatusEnum } from '@/common/enum/kyc-status.enum';

@Injectable()
export class KycService {
  constructor(
    private repo: KycRepository,
    private prisma: PrismaService,
  ) {}

  async submit(artistId: bigint, type: string, url: string) {
    const artist = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
    });

    if (!artist) {
      throw new BadRequestException('Artist not found');
    }

    // Create submission
    return this.repo.createSubmission(artistId, type, url);
  }

  mySubmissions(artistId: bigint) {
    return this.repo.getMySubmissions(artistId);
  }

  allPending() {
    return this.repo.getAllPending();
  }

  async review(id: bigint, status: KycStatusEnum, remarks?: string) {
    // Update submission
    const result = await this.repo.review(id, status, remarks);

    // Update artist verified status
    if (status === KycStatusEnum.verified) {
      await this.prisma.artistProfile.update({
        where: { id: result.artistId },
        data: { kycStatus: KycStatusEnum.verified },
      });
    }

    if (status === KycStatusEnum.rejected) {
      await this.prisma.artistProfile.update({
        where: { id: result.artistId },
        data: { kycStatus: KycStatusEnum.rejected },
      });
    }

    return result;
  }
}