import { IsOptional, IsString, IsInt, IsDateString, IsArray } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsInt()
  duration?: number;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsInt()
  albumId?: number;

  @IsOptional()
  @IsInt()
  genreId?: number;

  @IsOptional()
  @IsArray()
  featuringArtistIds?: number[];
}