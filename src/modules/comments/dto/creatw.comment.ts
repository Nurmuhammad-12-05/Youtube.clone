import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Bu juda foydali video!',
    description: 'Kommentariyaning matni',
  })
  @IsString()
  content: string;
}
