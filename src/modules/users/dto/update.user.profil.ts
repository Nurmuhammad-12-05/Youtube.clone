import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'Omadbek',
    description: 'Foydalanuvchining ismi (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Tuxtasinboyev',
    description: 'Foydalanuvchining familiyasi (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'Omadbek Tech',
    description: 'Foydalanuvchining kanal nomi (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  channelName?: string;

  @ApiPropertyOptional({
    example: 'Bu kanal dasturlash haqida videolar joylaydi',
    description: 'Kanal haqida qisqacha tavsif (majburiy emas)',
  })
  @IsOptional()
  @IsString()
  channelDescription?: string;
}
