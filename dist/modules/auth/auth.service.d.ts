import { CreateAuthDto } from './dto/create.auth.dto';
import { OtpService } from './otp.service';
import { VerifyOtpDto } from './dto/verify.otp.dto';
import { RegisterAuthDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginPhoneAndPasswordDto } from './dto/login.phone.password.dto';
import { LoginPhoneNumberDto } from './dto/login.phone.dto';
import { PrismaService } from 'src/core/databases/prisma.service';
import { Role } from '@prisma/client';
export declare class AuthService {
    private readonly db;
    private readonly jwtService;
    private readonly otpService;
    constructor(db: PrismaService, jwtService: JwtService, otpService: OtpService);
    sendOtpUser(createAuthDto: CreateAuthDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        message: string;
        session_token: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    register(registerAuthDto: RegisterAuthDto): Promise<{
        token: string;
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
    }>;
    loginWithPhoneAndPassword(loginhoneAndPassword: LoginPhoneAndPasswordDto): Promise<{
        message: string;
    }>;
    loginCode(verifyOtpDto: VerifyOtpDto): Promise<{
        token: string;
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
    }>;
    loginWithPhoneNumber(loginPhoneNumberDto: LoginPhoneNumberDto): Promise<{
        message: string;
    }>;
    updateAdmin(role: Role, id: string): Promise<{
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.Role;
        is_phone_verified: boolean;
        is_Blocked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
