import { Injectable, NotFoundException } from '@nestjs/common';
import { SettingsRepository } from '../repositories/settings.repository';

@Injectable()
export class SettingsService {
  constructor(private repo: SettingsRepository) {}

  getAll() {
    return this.repo.findAll();
  }

  async getByKey(key: string) {
    const setting = await this.repo.findByKey(key);
    if (!setting) {
      throw new NotFoundException(`Setting "${key}" not found`);
    }
    return setting;
  }

  update(key: string, value: string) {
    return this.repo.update(key, value);
  }

  create(key: string, value: string) {
    return this.repo.create(key, value);
  }
}