import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export const ArtistId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const prisma = request.prisma; // must attach PrismaService in middleware if needed
    const user = request.user;

    if (!user || !user.id) {
      throw new BadRequestException('User not found in request');
    }

    if (user.role === 'admin') {
      return request.body.artistId ?? request.query.artistId;
    }

    // user.id is from JWT
    const userId = BigInt(user.id);

    // find artist profile from Prisma
    const artist = await prisma.artistProfile.findUnique({
      where: { userId },
    });

    if (!artist) {
      throw new BadRequestException('Artist profile not found for this user');
    }

    return artist.id; // return artistId
  },
);