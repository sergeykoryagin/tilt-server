import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
    const PORT = process.env.PORT || 5001;
    const app = await NestFactory.create(AppModule);
    app.use(json({ limit: '10mb' }));

    app.use(urlencoded({ extended: true, limit: '10mb' }));
    await app.listen(PORT);
}
bootstrap();
