import { Controller, Post, Body, Get, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BearerAuthGuard } from '../common/guards/bearer-auth.guard';
import { BearerAuth, AuthContext } from '../common/decorators/bearer-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
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

