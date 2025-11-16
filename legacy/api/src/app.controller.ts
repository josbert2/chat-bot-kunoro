import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      message: '¡Hola mundo! API funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test')
  test() {
    return {
      message: 'Test endpoint - Hola mundo!',
      data: {
        backend: 'NestJS',
        version: '1.0.0',
        port: process.env.API_PORT || 3001,
      },
    };
  }
}

