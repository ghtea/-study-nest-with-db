import { NestFactory } from '@nestjs/core';
import {Logger} from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development'){
    app.enableCors();
  }
  else {
    app.enableCors({origin: process.env.origin });
    logger.log(`Acceping requests from "${process.env.origin}"`)
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
  logger.log(`Using db: ${process.env.RDS_HOSTNAME}`)
}
bootstrap();
