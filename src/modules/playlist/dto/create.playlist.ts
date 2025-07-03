import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Visibility } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlaylistDto {
  @ApiProperty({
    example: 'Frontend darslari',
    description: 'Playlist nomi (majburiy)',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Bu playlistda HTML, CSS, JS darslari mavjud',
    description: 'Playlist haqida tavsif (ixtiyoriy)',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    enum: Visibility,
    example: Visibility.PUBLIC,
    description: 'Playlist ko‘rinish holati: PUBLIC, PRIVATE, yoki UNLISTED',
  })
  @IsEnum(Visibility)
  visibility: Visibility;
}
