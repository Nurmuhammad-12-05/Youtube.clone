import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPhoneAndPasswordDto {
  @ApiProperty({
    description: 'Foydalanuvchining telefon raqami',
    example: '+998901234567',
    minLength: 12,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @MinLength(12)
  phone_number: string;

  @ApiProperty({
    description:
      'Kuchli parol: kamida 1 ta harf, raqam, katta harf, belgilar va uzunligi kamida 8 ta',
    example: 'StrongPass123!',
    minLength: 8,
  })
  @IsStrongPassword()
  password: string;
}
