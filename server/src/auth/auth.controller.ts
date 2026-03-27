import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/entities/user.entity';
import type { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);
    return result
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

  @Get('test')
  @UseGuards(JwtAuthGuard)
  test(@Req() req: Request) {
    return { msg: "Protected Route" };
  }
}
