import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS para dashboard y widget
  // Permitir cualquier origen para el widget (puede estar embebido en cualquier sitio)
  app.enableCors({
    origin: true, // Permitir cualquier origen (widget embebido)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-site-key'],
  });

  // Prefijo global
  app.setGlobalPrefix('v1');

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
}

bootstrap();

