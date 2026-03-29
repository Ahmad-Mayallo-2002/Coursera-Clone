import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import type { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);
    return result;
  }

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<User> {
    return this.authService.register(body);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  refresh(@Req() req: Request) {
    const user = req.user as { id: string; refreshToken: string };
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.forgotPassword(body.email);
  }

  @Post('verify-code')
  async verifyCode(@Body() body: { code: string }) {
    return await this.authService.verifyCode(body.code);
  }

  @Patch('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
