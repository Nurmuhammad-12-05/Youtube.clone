import {
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  @MaxLength(20)
  @MinLength(10)
  phone_number: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @MaxLength(50)
  @MinLength(6)
  username: string;

  @IsString()
  @MaxLength(50)
  @MinLength(4)
  firstName: string;

  @IsString()
  @MaxLength(50)
  @MinLength(4)
  lastName: string;

  @IsString()
  session_token: string;
}
