import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChannelDto {
  @ApiPropertyOptional({
    example: 'Omadbek TV',
    description: 'Kanal nomi (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  channelName?: string;

  @ApiPropertyOptional({
    example: 'Bu kanal dasturlash bo‘yicha videolar joylaydi.',
    description: 'Kanal tavsifi (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  channelDescription?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/banner.png',
    description: 'Kanal banner rasmi URL manzili (majburiy emas)',
  })
  @IsOptional()
  @IsUrl()
  channelBanner?: string;
}
