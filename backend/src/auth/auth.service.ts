import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './user.entity';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashedInput = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(hashedInput, 'hex'),
  );
}

function sanitizeUser(user: User) {
  const { password, ...rest } = user;
  return rest;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashPassword(dto.password),
      provider: 'local',
    });

    const saved = await this.userRepo.save(user);
    return sanitizeUser(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });

    // user.password bisa null (kalau akun google)
    if (!user || !user.password || !verifyPassword(dto.password, user.password)) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: sanitizeUser(user),
      accessToken,
      message: 'Login berhasil',
    };
  }

  async loginWithGoogle(googleUser: {
    email: string;
    name: string;
    googleId: string;
  }) {
    const { email, name, googleId } = googleUser;

    if (!email) {
      throw new BadRequestException('Google account tidak memiliki email.');
    }

    // cari by googleId dulu, kalau tidak ada baru by email (link account)
    let user = await this.userRepo.findOne({
      where: [{ googleId }, { email }],
    });

    if (!user) {
      user = this.userRepo.create({
        name,
        email,
        googleId,
        provider: 'google',
        password: null,
      });
      user = await this.userRepo.save(user);
    } else {
      // link jika sebelumnya user local tapi email sama
      if (!user.googleId) user.googleId = googleId;
      if (!user.provider) user.provider = 'google';
      if (!user.name && name) user.name = name;
      user = await this.userRepo.save(user);
    }

    const payload = { sub: user.id, email: user.email, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: sanitizeUser(user),
      accessToken,
    };
  }

  async me(payload: { sub: number }) {
    const user = await this.userRepo.findOne({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');
    return sanitizeUser(user);
  }
}
