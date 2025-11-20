import { IsOptional, IsString } from 'class-validator';

export class CreateStreamDto {
  @IsOptional()
  @IsString()
  device?: string;

  @IsOptional()
  @IsString()
  location?: string;
}