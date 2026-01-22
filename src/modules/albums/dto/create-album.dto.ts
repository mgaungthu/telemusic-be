import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  role: string;

  @ValidateIf((o) => o.role === 'admin')
  @IsNumber()
  artistId: number;

  @IsOptional()
  @IsNumber()
  genreId?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
