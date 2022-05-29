import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  await app.use(cookieParser());
  await app.listen(3000);
  console.log(`server start on port ${process.env.PORT}`);
  logger.log(`Application listening on port ${process.env.PORT}`);
}

bootstrap();
