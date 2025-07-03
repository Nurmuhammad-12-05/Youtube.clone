import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchSuggestionDto {
  @ApiPropertyOptional({
    example: 'nodejs',
    description: 'Qidiruv so‘rovi uchun kalit so‘z (query)',
  })
  @IsString()
  @IsOptional()
  q?: string;
}
