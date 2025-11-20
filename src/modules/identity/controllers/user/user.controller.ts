import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('sort') sort?: 'latest' | 'oldest' | 'az' | 'za',
  ) {
    return this.users.findAllWithFilters({
      page: Number(page),
      limit: Number(limit),
      search,
      role,
      status,
      sort,
    });
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findById(BigInt(id));
  }


  
}