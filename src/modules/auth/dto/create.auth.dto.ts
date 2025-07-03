import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Foydalanuvchining telefon raqami',
    example: '+998901234567',
    minLength: 10,
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  @MinLength(10)
  phone_number: string;
}
