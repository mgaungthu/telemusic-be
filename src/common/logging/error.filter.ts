import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppLoggerService } from './logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Determine HTTP status
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Error message
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message;

    // Log error to console + file
    this.logger.appError(
      `Error: ${JSON.stringify(message)} | Status: ${status}`,
    );

    // Send JSON response
    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}