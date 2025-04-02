import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env', // 👈 Load .env from parent directory
      isGlobal: true,         // 👈 Makes config available app-wide
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
