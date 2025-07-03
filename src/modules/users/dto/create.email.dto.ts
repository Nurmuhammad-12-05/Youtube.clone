import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailVerifycationLinkDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchining email manzili (tasdiqlovchi link uchun)',
  })
  @IsString()
  @IsEmail()
  email: string;
}
