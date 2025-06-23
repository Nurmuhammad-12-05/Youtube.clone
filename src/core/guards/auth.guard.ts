import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { token } = request.cookies;

    const classHandel = context.getClass();

    const functionHandel = context.getHandler();

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      classHandel,
      functionHandel,
    ]);

    const isAdmin = this.reflector.get('isAdmin', functionHandel);

    if (isPublic && !isAdmin) return true;

    try {
      if (isAdmin) {
        const { userId, role } = await this.jwtService.verifyAsync(token);

        request.userId = userId;

        request.role = role;

        return true;
      } else {
        const { userId, role } = await this.jwtService.verifyAsync(token);

        request.userId = userId;

        request.role = role;

        return true;
      }
    } catch (error) {
      throw new InternalServerErrorException('Token invalide.!!');
    }
  }
}
