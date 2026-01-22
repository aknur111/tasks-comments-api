import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(password: string, role: UserRole) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ password: hashed, role });
    return this.issueTokens(user.id, user.role);
  }

  async login(id: string, password: string) {
    const user = await this.usersService.findByIdWithPassword(id);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.role);
  }

  async refresh(refreshToken: string) {
    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = payload.sub as string;
    const user = await this.usersService.findByIdWithRefreshHash(userId);
    if (!user?.refreshTokenHash) throw new UnauthorizedException('No refresh token');

    const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!ok) throw new UnauthorizedException('Invalid refresh token');

    return this.issueTokens(user.id, user.role);
  }

  async logout(userId: string) {
    await this.usersService.setRefreshTokenHash(userId, null);
    return { ok: true };
  }

  private async issueTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setRefreshTokenHash(userId, refreshHash);

    return { userId, role, accessToken, refreshToken };
  }
}
