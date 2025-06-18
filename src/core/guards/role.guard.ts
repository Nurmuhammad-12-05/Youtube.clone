import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.userId;
    const userRole = request.role;

    const classHandel = context.getClass();
    const functionHandel = context.getHandler();

    const role = this.reflector.getAllAndOverride('role', [
      classHandel,
      functionHandel,
    ]);

    if (!role.includes(userRole)) {
      throw new ForbiddenException('Role requeired');
    }

    return true;
  }
}
