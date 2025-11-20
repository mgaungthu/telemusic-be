import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLoggerService extends Logger {
  private logFile = path.join(process.cwd(), 'logs/app.log');

  constructor() {
    super();
    this.ensureLogDirectory();
  }

  private ensureLogDirectory() {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
  }

  logToFile(message: string) {
    fs.appendFileSync(
      this.logFile,
      `[${new Date().toISOString()}] ${message}\n`
    );
  }

  appLog(message: string) {
    this.log(message);
    this.logToFile(message);
  }

  appError(message: string) {
    this.error(message);
    this.logToFile(`ERROR: ${message}`);
  }
}