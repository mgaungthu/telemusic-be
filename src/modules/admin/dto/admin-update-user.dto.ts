import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdminUserRole, AdminUserStatus } from './admin-create-user.dto';

class UpdateArtistProfileDto {
  @IsOptional()
  @IsString()
  artistName?: string;

  @IsOptional()
  @IsInt()
  genreId?: number;

  @IsOptional()
  @IsInt()
  countryId?: number;

  @IsOptional()
  @IsInt()
  cityId?: number;

  @IsOptional()
  @IsString()
  bio?: string;
}

export class AdminUpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AdminUserRole)
  role?: AdminUserRole;

  @IsOptional()
  @IsEnum(AdminUserStatus)
  status?: AdminUserStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateArtistProfileDto)
  artist?: UpdateArtistProfileDto;
}