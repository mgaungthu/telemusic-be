import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';

import { AuthController } from './controllers/auth/auth.controller';
import { UserController } from './controllers/user/user.controller';

import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { UserRepository } from './repositories/user.repository';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, UserRepository, PrismaService, JwtStrategy],
  exports: [UserService],
})
export class IdentityModule {}