import { IsNumberString } from 'class-validator';

export class RevenueRateDto {
  @IsNumberString()
  rate: string; // Store as string because Prisma setting.value is string
}