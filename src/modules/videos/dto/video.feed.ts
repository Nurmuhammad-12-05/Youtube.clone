import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DurationEnum {
  short = 'short',
  medium = 'medium',
  long = 'long',
}

export enum SortEnum {
  popular = 'popular',
  newest = 'newest',
  oldest = 'oldest',
  most_viewed = 'most_viewed',
}

export class GetFeedDto {
  @ApiProperty({
    example: 10,
    minimum: 1,
    maximum: 50,
    description: 'Har bir sahifada necha ta video chiqarilishi (1-50)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => Math.min(Number(value) || 20, 50))
  limit: number;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Sahifa raqami (1 dan boshlab)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Math.max(Number(value) || 1, 1))
  page: number;

  @ApiPropertyOptional({
    example: 'technology',
    description: 'Video kategoriyasi nomi (optional)',
  })
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    enum: DurationEnum,
    example: DurationEnum.short,
    description: 'Videoning davomiyligi bo‘yicha filter: short | medium | long',
  })
  @IsOptional()
  @IsEnum(DurationEnum)
  duration?: DurationEnum;

  @ApiPropertyOptional({
    enum: SortEnum,
    example: SortEnum.popular,
    description: 'Videolarni sort qilish usuli: popular | newest | oldest | most_viewed',
  })
  @IsOptional()
  @IsEnum(SortEnum)
  sort?: SortEnum;
}
