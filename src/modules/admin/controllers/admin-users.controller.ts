import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminUsersService } from '../services/admin-users.service';
import { AdminCreateUserDto } from '../dto/admin-create-user.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { SpacesService } from '@/modules/uploads/services/spaces.service';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(
    private readonly service: AdminUsersService,
    private readonly spacesService: SpacesService,
  ) {}

  // ➕ Create user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() dto: AdminCreateUserDto,
    @Req() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = await this.service.createUser(dto);

    // Handle avatar upload if file exists
    if (file && dto.role === 'artist') {
      const extension = file.mimetype.split('/')[1];
      const key = `avatars/${user.id}/avatar.${extension}`;

      const { key: savedKey } = await this.spacesService.putPublicObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });

      // Update the artist profile avatar field along with other artist fields
      await this.service.updateUser(user.id, {
        artistName: dto.artistName,
        bio: dto.bio,
        genreId: dto.genreId,
        countryId: dto.countryId,
        cityId: dto.cityId,
        avatar: `${this.spacesService.cdnBase}/${savedKey}`,
      });

      (user as any).artist = (user as any).artist || {};
      (user as any).artist.avatar = `${this.spacesService.cdnBase}/${savedKey}`;
    }

    return user;
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
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() body: Partial<AdminCreateUserDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('UPDATE BODY 👉', body);
    console.log('UPDATE FILE 👉', file);

    if (file) {
      const extension = file.mimetype.split('/')[1];
      const key = `avatars/${id}/avatar-${Date.now()}.${extension}`;

      const { key: savedKey } = await this.spacesService.putPublicObject({
        key,
        body: file.buffer,
        contentType: file.mimetype,
      });

      body.avatar = `${this.spacesService.cdnBase}/${savedKey}`;
    }

    console.log(body.avatar, "Update avatar")

    return this.service.updateUser(BigInt(id), body);
  }
}