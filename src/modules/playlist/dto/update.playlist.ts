import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Visibility } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlaylistDto {
  @ApiPropertyOptional({
    example: 'Yangi playlist nomi',
    description: 'Playlist nomi (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'Bu playlistda yangi videolar mavjud',
    description: 'Playlist tavsifi (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: Visibility,
    example: Visibility.PRIVATE,
    description: 'Playlist ko‘rinish holati: PUBLIC, PRIVATE, UNLISTED',
  })
  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
