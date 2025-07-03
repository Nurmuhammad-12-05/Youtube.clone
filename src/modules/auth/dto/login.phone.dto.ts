import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPhoneNumberDto {
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
}
