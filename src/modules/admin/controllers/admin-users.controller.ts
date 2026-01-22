import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminUsersService } from '../services/admin-users.service';
import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(private readonly service: AdminUsersService) {}

  // ➕ Create user
  @Post()
  create(@Body() dto: AdminCreateUserDto) {
    return this.service.createUser(dto);
  }

  // 📄 Get users list
  @Get()
  findAll(
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getUsers({ role, status });
  }

  // 🔍 Get single user
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.getUserById(id);
  }

  // ✏️ Update user
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<AdminCreateUserDto>,
  ) {
    return this.service.updateUser(id, body);
  }
}