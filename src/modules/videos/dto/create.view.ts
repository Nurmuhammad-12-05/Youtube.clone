import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateViewDto {
  @IsInt()
  watchTime: number;

  @IsString()
  quality: string;

  @IsString()
  device: string;

  @IsString()
  location: string;
}
