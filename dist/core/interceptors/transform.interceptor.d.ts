import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
declare class TransformInterceptor implements NestInterceptor {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>;
}
export default TransformInterceptor;
