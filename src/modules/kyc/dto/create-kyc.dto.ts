import { IsString } from 'class-validator';

export class CreateKycDto {
  @IsString()
  documentType: string;

  @IsString()
  documentUrl: string;
}