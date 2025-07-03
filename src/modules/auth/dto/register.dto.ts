import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAuthDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchi telefon raqami (10-20 belgidan iborat)',
  })
  @IsString()
  @MaxLength(20)
  @MinLength(10)
  phone_number: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description: 'Kuchli parol (kamida 1 katta, 1 kichik harf, raqam va belgi)',
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'omadbek99',
    description: 'Foydalanuvchi nomi (6-50 belgidan iborat)',
  })
  @IsString()
  @MaxLength(50)
  @MinLength(6)
  username: string;

  @ApiProperty({
    example: 'Omadbek',
    description: 'Ism (4-50 belgidan iborat)',
  })
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  firstName: string;

  @ApiProperty({
    example: 'Tuxtasinboyev',
    description: 'Familiya (4-50 belgidan iborat)',
  })
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  lastName: string;

  @ApiProperty({
    example: 'session_token_abc123',
    description: 'Session token, FCM token yoki boshqa autentifikatsiya sessiyasi uchun',
  })
  @IsString()
  session_token: string;
}
