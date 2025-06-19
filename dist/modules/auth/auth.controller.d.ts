import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create.auth.dto';
import { VerifyOtpDto } from './dto/verify.otp.dto';
import { Response } from 'express';
import { RegisterAuthDto } from './dto/register.dto';
import { LoginPhoneAndPasswordDto } from './dto/login.phone.password.dto';
import { LoginPhoneNumberDto } from './dto/login.phone.dto';
import { Role } from '@prisma/client';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendOtpUser(createAuthDto: CreateAuthDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        session_token: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    register(registerAuthDto: RegisterAuthDto, res: Response): Promise<{
        message: string;
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            is_phone_verified: boolean;
            is_Blocked: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    loginWithPhoneAndPassword(loginhoneAndPassword: LoginPhoneAndPasswordDto): Promise<{
        message: string;
    }>;
    loginCode(verifyOtpDto: VerifyOtpDto, res: Response): Promise<{
        message: string;
        user: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            is_phone_verified: boolean;
            is_Blocked: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        token: string;
    }>;
    loginWithPhoneNumber(loginPhoneNumberDto: LoginPhoneNumberDto): Promise<{
        message: string;
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
    addAdmin(role: Role, id: string): Promise<{
        message: string;
        admin: {
            id: string;
            username: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            is_phone_verified: boolean;
            is_Blocked: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
