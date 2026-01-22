
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';
import { AppLoggerService } from './common/logging/logger.service';
import { AllExceptionsFilter } from './common/logging/error.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      'http://localhost:3001', // Next.js dev
      'http://localhost:3000', // optional
    ],
    credentials: true,
  });

  const logger = app.get(AppLoggerService);
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  app.useGlobalInterceptors(new BigIntInterceptor());
  // ✅ enable global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(3000);
}
bootstrap();