import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateViewDto {
  @ApiProperty({
    example: 120,
    description: 'Videoni tomosha qilingan vaqt (soniyalarda)',
  })
  @IsInt()
  watchTime: number;

  @ApiProperty({
    example: '1080p',
    description: 'Tomoša sifati (resolution)',
  })
  @IsString()
  quality: string;

  @ApiProperty({
    example: 'mobile',
    description: 'Qurilma turi (masalan: mobile, desktop, tv)',
  })
  @IsString()
  device: string;

  @ApiProperty({
    example: 'Toshkent, Uzbekistan',
    description: 'Tomošabin joylashuvi',
  })
  @IsString()
  location: string;
}
