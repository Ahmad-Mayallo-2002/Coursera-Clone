import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-auth.strategy';
import { RefreshStrategy } from './strategies/refresh-auth.strategy';
import { LocalStrategy } from './strategies/local-auth.strategy';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy, LocalStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
  ],
})
export class AuthModule {}
