import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsInt()
  duration: number;

  @IsOptional()
  @IsInt()
  albumId?: number;

  @IsInt()
  artistId: number;

  @IsOptional()
  @IsInt()
  genreId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  featuringArtistIds?: number[];
}