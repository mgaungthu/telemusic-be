import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppLoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: AppLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, user } = req;

    const userId = user?.id ? `user=${user.id}` : 'public';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - start;
        this.logger.appLog(`[${method}] ${originalUrl} - ${userId} - ${time}ms`);
      })
    );
  }
}