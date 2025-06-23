import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Visibility } from '@prisma/client';

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
