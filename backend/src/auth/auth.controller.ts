import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // 1) Redirect ke Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    return;
  }

  // 2) Callback dari Google -> buat/find user -> keluarkan token -> redirect ke FE
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const { accessToken } = await this.authService.loginWithGoogle(req.user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/oauth?token=${encodeURIComponent(
      accessToken,
    )}`;

    return res.redirect(redirectUrl);
  }

  // 3) Endpoint cek profil berdasarkan Bearer token
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() req: any) {
    return this.authService.me(req.user);
  }
}
