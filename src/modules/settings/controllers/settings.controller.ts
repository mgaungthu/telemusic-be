import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingDto } from '../dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private service: SettingsService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Get(':key')
  getByKey(@Param('key') key: string) {
    return this.service.getByKey(key);
  }

  @Put(':key')
  update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.service.update(key, dto.value);
  }

  @Post()
  create(@Body() body: { key: string; value: string }) {
    return this.service.create(body.key, body.value);
  }
}