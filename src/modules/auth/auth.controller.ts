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
import e, { Response } from 'express';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginPhoneAndPasswordDto } from './dto/login.phone.password.dto';
import { LoginPhoneNumberDto } from './dto/login.phone.dto';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Role } from '@prisma/client';

@Controller('auth')
@SetMetadata('isPublic', true)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-otp')
  async sendOtpUser(@Body() createAuthDto: CreateAuthDto) {
    const response = await this.authService.sendOtpUser(createAuthDto);

    return response;
  }

  @Post('/verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const result = await this.authService.verifyOtp(verifyOtpDto);

    return result;
  }

  @Post('/register')
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
  async loginWithPhoneAndPassword(
    @Body() loginhoneAndPassword: LoginPhoneAndPasswordDto,
  ) {
    const response =
      await this.authService.loginWithPhoneAndPassword(loginhoneAndPassword);

    return response;
  }

  @Post('/login-check-code')
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
  async loginWithPhoneNumber(@Body() loginPhoneNumberDto: LoginPhoneNumberDto) {
    const response =
      await this.authService.loginWithPhoneNumber(loginPhoneNumberDto);

    return response;
  }

  @Post('/logout')
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
