import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user.repository';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private users: UserRepository, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new UnauthorizedException('Email already exists');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ ...dto, password: hashed });
    return { message: 'User registered successfully', user };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwt.sign({ sub:  user.id.toString(), role: user.role });
    return { access_token: token, user };
  }
}