import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({
    example: 'My first video',
    description: 'Video nomi',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Bu videoda texnologiyalar haqida gaplashamiz',
    description: 'Video haqida tavsif',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2f13743d-9984-49e0-99b4-3fcf8742c2d5',
    description: 'Videoni yuklagan foydalanuvchi IDsi (UUID)',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
