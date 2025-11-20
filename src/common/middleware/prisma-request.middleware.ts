import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class PrismaRequestMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  use(req: any, res: any, next: () => void) {
    req.prisma = this.prisma; // attach prisma to request
    next();
  }
}