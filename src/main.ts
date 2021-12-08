import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));
  await app.listen(PORT);
}
bootstrap();
