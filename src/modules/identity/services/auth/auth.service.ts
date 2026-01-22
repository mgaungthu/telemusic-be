import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { AppException } from '@/common/exceptions/app.exception';
import { ERROR_KEYS } from '@/common/constants/error-keys';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user.repository';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private users: UserRepository, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existingEmail = await this.users.findByEmail(dto.email);
    if (existingEmail) {
      throw new AppException(
        ERROR_KEYS.USER.EMAIL_EXISTS,
        HttpStatus.UNPROCESSABLE_ENTITY,
        { field: 'email' },
      );
    }

    if (dto.phoneNumber) {
      const existingPhone = await this.users.findByPhoneNumber(dto.phoneNumber);
      if (existingPhone) {
        throw new AppException(
          ERROR_KEYS.USER.PHONE_EXISTS,
          HttpStatus.UNPROCESSABLE_ENTITY,
          { field: 'phoneNumber' },
        );
      }
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ ...dto, password: hashed });
    const token = this.jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });
    return { message: 'User registered successfully', user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new AppException(
        ERROR_KEYS.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new AppException(
        ERROR_KEYS.AUTH.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.jwt.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    // ✅ ONLY return what controller needs
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      },
    };
  }
}