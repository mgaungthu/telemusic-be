import { IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  userId: number;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  albumId?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  genreId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  featuringArtistIds?: number[];
}