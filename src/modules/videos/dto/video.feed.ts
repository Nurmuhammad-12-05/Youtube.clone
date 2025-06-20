import { IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @Transform(({ value }) => Math.min(Number(value) || 20, 50))
  limit: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => Math.max(Number(value) || 1, 1))
  page: number;

  @IsOptional()
  category?: string;

  @IsOptional()
  @IsEnum(DurationEnum)
  duration?: DurationEnum;

  @IsOptional()
  @IsEnum(SortEnum)
  sort?: SortEnum;
}
