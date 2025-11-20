import { IsNumber } from 'class-validator';

export class AddTrackDto {
  @IsNumber()
  trackId: number;
}