import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  // ✅ Load .env from parent directory
  ConfigModule.forRoot({
    envFilePath: join(__dirname, '../../.env'),
    isGlobal: true,
  });

  const app = await NestFactory.create(AppModule);

  // ✅ Allow frontend (running on port 3000) to call this backend
  app.enableCors({
    origin: 'http://172.28.113.50:3000',
  });

  await app.listen(3001); // ✅ Avoids port clash with frontend
}
bootstrap();
