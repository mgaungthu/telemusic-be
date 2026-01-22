import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    key: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    extra?: Record<string, any>,
  ) {
    super(
      {
        key,
        ...extra,
      },
      status,
    );
  }
}