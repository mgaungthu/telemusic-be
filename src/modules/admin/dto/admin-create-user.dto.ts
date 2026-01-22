import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AdminUserRole {
  ADMIN = 'admin',
  USER = 'user',
  ARTIST = 'artist',
}

export enum AdminUserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

class ArtistProfileDto {
  @IsString()
  @IsNotEmpty()
  artistName: string;

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

export class AdminCreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(AdminUserRole)
  role: AdminUserRole;

  @IsOptional()
  @IsEnum(AdminUserStatus)
  status?: AdminUserStatus;

  @IsOptional()
  @ValidateNested()
  @Type(() => ArtistProfileDto)
  artist?: ArtistProfileDto;
}