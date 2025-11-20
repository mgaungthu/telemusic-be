import { IsEnum, IsOptional, IsString } from 'class-validator';
import { KycStatusEnum } from '@/common/enum/kyc-status.enum';

export class ReviewKycDto {
  @IsEnum(KycStatusEnum)
  status: KycStatusEnum;

  @IsOptional()
  @IsString()
  remarks?: string;
}