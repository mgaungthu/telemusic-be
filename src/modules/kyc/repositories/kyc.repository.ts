import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { KycStatusEnum } from '@/common/enum/kyc-status.enum';

@Injectable()
export class KycRepository {
  constructor(private prisma: PrismaService) {}

  createSubmission(artistId: bigint, type: string, url: string) {
    return this.prisma.kycSubmission.create({
      data: {
        artistId,
        documentType: type,
        documentUrl: url,
      },
    });
  }

  getMySubmissions(artistId: bigint) {
    return this.prisma.kycSubmission.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
    });
  }

  getAllPending() {
    return this.prisma.kycSubmission.findMany({
      where: { status: KycStatusEnum.pending },
      orderBy: { createdAt: 'desc' },
    });
  }

  review(id: bigint, status: KycStatusEnum, remarks?: string) {
    return this.prisma.kycSubmission.update({
      where: { id },
      data: {
        status,
        remarks,
      },
    });
  }
}