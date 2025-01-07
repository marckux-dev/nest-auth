import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Set global prefix
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || 'api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
