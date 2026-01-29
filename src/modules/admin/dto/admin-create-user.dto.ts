import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
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

  // Flat artist fields
  @IsOptional()
  @IsString()
  artistName?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  genreId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  countryId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cityId?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}