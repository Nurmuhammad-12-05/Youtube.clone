import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({
    example: '+998901234567',
    description: 'Foydalanuvchining telefon raqami (10-20 belgidan iborat)',
  })
  @IsString()
  @MaxLength(20)
  @MinLength(10)
  phone_number: string;

  @ApiProperty({
    example: '123456',
    description: 'SMS orqali yuborilgan tasdiqlovchi kod (1-6 belgidan iborat)',
  })
  @IsString()
  @MaxLength(6)
  @MinLength(1)
  code: string;
}
