import { Controller, Post, Body, UseGuards, Get, Res, Req, Headers } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('platform') platform: string,
  ) {
    const { token, user } = await this.auth.register(dto);

    if (platform === 'mobile') {
      return { success: true, token, user };
    } else {
      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      return { success: true, user };
    }
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('platform') platform: string,
  ) {
    const { token, user } = await this.auth.login(dto);

    if (platform === 'mobile') {
      return { success: true, token, user };
    } else {
      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      return { success: true, user };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req : any) {
    return req.user;
  }

  
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { success: true };
  }
}