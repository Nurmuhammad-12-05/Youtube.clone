import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddVideoToPlaylistDto {
  @ApiProperty({
    example: 'a1b2c3d4-5678-90ef-ghij-klmnopqrstuv',
    description: 'Playlistga qo‘shilayotgan video IDsi (UUID bo‘lishi mumkin)',
  })
  @IsString()
  @IsNotEmpty()
  videoId: string;

  @ApiProperty({
    example: 1,
    description: 'Video playlist ichida qaysi pozitsiyada bo‘lishi (index)',
  })
  @IsNumber()
  position: number;
}
