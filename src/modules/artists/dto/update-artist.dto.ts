import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  blueMark?: boolean;
}