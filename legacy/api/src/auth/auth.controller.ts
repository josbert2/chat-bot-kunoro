import { Controller, Post, Body, Get, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import { BearerAuth, AuthContext } from '../common/decorators/bearer-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    console.log('🔵 [AUTH CONTROLLER] POST /auth/register recibido:', {
      name: body.name,
      email: body.email,
      hasPassword: !!body.password,
    });
    try {
      const result = await this.authService.register(body);
      console.log('✅ [AUTH CONTROLLER] Registro exitoso');
      return result;
    } catch (error) {
      console.error('❌ [AUTH CONTROLLER] Error en registro:', error.message);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    console.log('🔵 [AUTH CONTROLLER] POST /auth/login recibido:', {
      email: body.email,
      hasPassword: !!body.password,
    });
    try {
      const result = await this.authService.login(body);
      console.log('✅ [AUTH CONTROLLER] Login exitoso');
      return result;
    } catch (error) {
      console.error('❌ [AUTH CONTROLLER] Error en login:', error.message);
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @Get('me')
  @UseGuards(BearerAuthGuard)
  async getMe(@BearerAuth() auth: AuthContext) {
    return this.authService.getMe(auth.user.id);
  }
}

