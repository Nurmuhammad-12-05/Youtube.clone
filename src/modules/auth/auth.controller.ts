import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  Put,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create.auth.dto';
import { VerifyOtpDto } from './dto/verify.otp.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginPhoneAndPasswordDto } from './dto/login.phone.password.dto';
import { LoginPhoneNumberDto } from './dto/login.phone.dto';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Role } from '@prisma/client';
import { Response } from 'express';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Auth') // Swaggerdagi bo'lim nomi
@Controller('auth')
@SetMetadata('isPublic', true)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-otp')
  @ApiOperation({ summary: 'Telefon raqamga OTP kod yuborish' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 201, description: 'OTP yuborildi' })
  async sendOtpUser(@Body() createAuthDto: CreateAuthDto) {
    const response = await this.authService.sendOtpUser(createAuthDto);
    return response;
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'OTP kodni tekshirish' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'Kod muvaffaqiyatli tasdiqlandi' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(verifyOtpDto);
    return result;
  }

  @Post('/register')
  @ApiOperation({ summary: 'Ro‘yxatdan o‘tish' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({ status: 201, description: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi' })
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.register(registerAuthDto);

    res.cookie('token', token, {
      maxAge: 8.1 * 3600 * 1000,
      httpOnly: true,
    });

    return {
      message: 'Muvaffaqiyatli ro‘yxatdan o‘tildi',
      user,
      token,
    };
  }

  @Post('/login-phone-password')
  @ApiOperation({ summary: 'Telefon raqam va parol orqali kirish' })
  @ApiBody({ type: LoginPhoneAndPasswordDto })
  @ApiResponse({ status: 200, description: 'Login muvaffaqiyatli amalga oshdi' })
  async loginWithPhoneAndPassword(
    @Body() loginhoneAndPassword: LoginPhoneAndPasswordDto,
  ) {
    const response =
      await this.authService.loginWithPhoneAndPassword(loginhoneAndPassword);

    return response;
  }

  @Post('/login-check-code')
  @ApiOperation({ summary: 'SMS kodi orqali tizimga kirish' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'Login muvaffaqiyatli amalga oshdi (SMS orqali)' })
  async loginCode(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.loginCode(verifyOtpDto);

    res.cookie('token', token, {
      maxAge: 8.1 * 3600 * 1000,
      httpOnly: true,
    });

    return {
      message: 'Muvaffaqiyatli kirildi',
      user,
      token,
    };
  }

  @Post('/login-phone-number')
  @ApiOperation({ summary: 'Telefon raqam orqali kirish' })
  @ApiBody({ type: LoginPhoneNumberDto })
  @ApiResponse({ status: 200, description: 'Login uchun SMS kod yuborildi' })
  async loginWithPhoneNumber(@Body() loginPhoneNumberDto: LoginPhoneNumberDto) {
    const response =
      await this.authService.loginWithPhoneNumber(loginPhoneNumberDto);

    return response;
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Tizimdan chiqish' })
  @ApiResponse({ status: 200, description: 'Logout muvaffaqiyatli amalga oshdi' })
  async logout(@Res({ passthrough: true }) response: Response) {
    try {
      response.setHeader(
        'Set-Cookie',
        `token=; Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`,
      );

      return {
        message: 'Muvaffaqiyatli tizimdan chiqildi',
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Put('/admin/:id')
  @UseGuards(RoleGuard)
  @SetMetadata('isAdmin', true)
  @SetMetadata('role', ['SUPERADMIN'])
  @ApiOperation({ summary: 'Admin qo‘shish (faqat SUPERADMIN)' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          example: 'ADMIN',
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Admin muvaffaqiyatli qo‘shildi' })
  async addAdmin(@Body('role') role: Role, @Param('id') id: string) {
    try {
      const admin = await this.authService.updateAdmin(role, id);

      return {
        message: 'Admin qoshildi.',
        admin,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, 500);
    }
  }
}
