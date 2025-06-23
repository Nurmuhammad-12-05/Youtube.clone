import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddVideoToPlaylistDto {
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @IsNumber()
  position: number;
}
