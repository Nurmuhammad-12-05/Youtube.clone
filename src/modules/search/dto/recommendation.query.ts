import { IsOptional, IsUUID, IsString } from 'class-validator';

export class RecommendationQueryDto {
  @IsUUID()
  @IsString()
  videoId: string;

  @IsOptional()
  limit?: string;

  @IsOptional()
  page?: string;
}
