import { IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum CommentSort {
  TOP = 'top',
  NEW = 'new',
  OLD = 'old',
}

export class QueryCommentsDto {
  @ApiPropertyOptional({
    example: '10',
    description: 'Nechta komment ko‘rsatish kerakligini bildiradi (default: 10)',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Qaysi sahifa (pagination) (default: 1)',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    enum: CommentSort,
    example: CommentSort.NEW,
    description: 'Kommentlarni saralash usuli: top, new, old',
  })
  @IsOptional()
  @IsEnum(CommentSort)
  sort?: CommentSort;
}
