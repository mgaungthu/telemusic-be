import { SharePlatformEnum } from '@/common/enum/share-platform.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';



export class ShareTrackDto {
  @IsEnum(SharePlatformEnum)
  @IsNotEmpty()
  platform: SharePlatformEnum;
} 