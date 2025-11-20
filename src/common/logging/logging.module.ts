import { Module } from '@nestjs/common';
import { AppLoggerService } from './logger.service';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  providers: [AppLoggerService, LoggingInterceptor],
  exports: [AppLoggerService, LoggingInterceptor]
})
export class LoggingModule {}