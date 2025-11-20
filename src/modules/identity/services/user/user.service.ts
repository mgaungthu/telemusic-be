import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private users: UserRepository) {}

  findByEmail(email: string) {
    try {
      return this.users.findByEmail(email);
    } catch (e) {
      throw e;
    }
  }

  findById(id: bigint) {
    try {
      return this.users.findById(id);
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    try {
      return this.users.findAll();
    } catch (e) {
      throw e;
    }
  }

  findAllWithFilters(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    status?: string;
    sort?: 'latest' | 'oldest' | 'az' | 'za';
  }) {
    if (params.page < 1) {
      throw new BadRequestException('Page must be 1 or greater');
    }

    if (params.limit < 1) {
      throw new BadRequestException('Limit must be 1 or greater');
    }
    try {
      return this.users.findAllWithFilters(params);
    } catch (e) {
      throw e;
    }
  }
}