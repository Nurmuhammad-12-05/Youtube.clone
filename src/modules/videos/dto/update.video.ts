import { Visibility } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVideoDto {
  @ApiProperty({
    example: 'Yangi video sarlavhasi',
    description: 'Videoning sarlavhasi',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Bu videoda dasturlash haqida gaplashamiz.',
    description: 'Videoning qisqacha tavsifi',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    enum: Visibility,
    example: Visibility.PUBLIC,
    description: 'Videoning ko‘rinish darajasi (PUBLIC, PRIVATE, UNLISTED)',
  })
  @IsNotEmpty()
  @IsEnum(Visibility)
  visibility: Visibility;

  @ApiProperty({
    example: ['programming', 'javascript', 'nestjs'],
    description: 'Videoga teglar ro‘yxati',
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  tags: Array<string>;
}
