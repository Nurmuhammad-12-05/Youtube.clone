import { IsOptional, IsUUID, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecommendationQueryDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'Tavsiyalar olinadigan video IDsi (UUID formatda)',
  })
  @IsUUID()
  @IsString()
  videoId: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Nechta tavsiya olish (default: 10)',
  })
  @IsOptional()
  limit?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Sahifa raqami (pagination)',
  })
  @IsOptional()
  page?: string;
}
