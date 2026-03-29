import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { sendMail } from '../utils/sendMail';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Role } from '../enum/role.enum';
import { Payload } from '../interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterDto): Promise<User> {
    const user = await this.userRepo.findOneBy({ email: input.email });
    if (user) throw new ConflictException('This Email is Already Exist');

    const hashedPassword = await hash(input.password, 10);

    const newUser = this.userRepo.create({
      ...input,
      password: hashedPassword,
    });
    return await this.userRepo.save(newUser);
  }

  async login(input: LoginDto) {
    const user = await this.validateUser(input);
    return this.issueTokens(user);
  }

  async validateUser(input: LoginDto): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email: input.email },
      relations: { teacher: true },
    });
    if (!user) throw new UnauthorizedException('Incorrect Email or Password');

    const comparePassword = await compare(input.password, user.password);
    if (!comparePassword)
      throw new UnauthorizedException('Incorrect Email or Password');

    return user;
  }

  async issueTokens(user: User) {
    const payload: Payload = {
      id: user.id,
      role: user.role,
    };

    if (user.role === Role.TEACHER) payload.teacherId = user.teacher.id;

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    const hashedRefreshToken = await hash(refreshToken, 10);
    await this.userRepo.update(
      { id: user.id },
      { refreshToken: hashedRefreshToken },
    );

    return {
      accessToken,
      refreshToken,
      id: user.id,
      role: user.role,
    };
  }

  async refreshTokens(id: string, refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'role', 'refreshToken'],
    });

    if (!user) throw new ForbiddenException('User Not Found');
    if (!user.refreshToken)
      throw new ForbiddenException('Refresh Token Not Found');

    const isMatch = await compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Invalid Refresh Token');

    return this.issueTokens(user as User);
  }

  async forgotPassword(email: string): Promise<string> {
    const code = await sendMail(email);
    await this.cache.set(`${code}`, email, 1000 * 60 * 15);
    return 'Verification Code Sent Successfully';
  }

  async verifyCode(code: string): Promise<string> {
    const email = (await this.cache.get(code)) as string;
    if (!email || !code)
      throw new BadRequestException('Invalid or Expired Verification Code');
    await this.cache.del('code');
    return email;
  }

  async resetPassword(input: ResetPasswordDto): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ email: input.email });
    if (!user) throw new NotFoundException('User not Found');

    if (!input.newPassword !== !input.confirmNewPassword)
      throw new BadRequestException('Two Passwords Must Be Matched');

    const hashedPassword = await hash(input.newPassword, 10);
    await this.userRepo.update({ id: user.id }, { password: hashedPassword });

    return true;
  }
}
