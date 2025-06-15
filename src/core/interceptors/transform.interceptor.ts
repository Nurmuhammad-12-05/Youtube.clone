import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const handle = context.getHandler();

    const isFreeResponse = this.reflector.get('isFreeResponse', handle);

    const statusCode = response.statusCode;

    const message = response.message;

    if (!isFreeResponse) {
      return next.handle().pipe(
        map((data) => {
          return {
            status: statusCode,
            success: true,
            message: message,
            ...(typeof data !== 'object' || Array.isArray(data)
              ? { data }
              : data),
          };
        }),
      );
    }

    return next.handle();
  }
}

export default TransformInterceptor;
