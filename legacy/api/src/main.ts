import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log('🔵 [MAIN] Archivo main.ts cargado');
console.log('🔵 [MAIN] Node version:', process.version);
console.log('🔵 [MAIN] Environment:', process.env.NODE_ENV || 'development');

async function bootstrap() {
  try {
    console.log('🟢 [MAIN] Iniciando aplicación NestJS...');
    console.log('🟢 [MAIN] Creando instancia de AppModule...');
    const app = await NestFactory.create(AppModule);
    console.log('✅ [MAIN] AppModule creado exitosamente');
    
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
    console.log(`✅ API running on http://localhost:${port}`);
    console.log(`✅ Health check: http://localhost:${port}/v1/health`);
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

console.log('🔵 [MAIN] Llamando a bootstrap()...');
bootstrap().catch((error) => {
  console.error('❌ [MAIN] Error fatal en bootstrap:', error);
  process.exit(1);
});

