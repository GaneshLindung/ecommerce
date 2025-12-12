import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
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
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashedInput, 'hex'));
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
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      password: hashPassword(dto.password),
    });

    const saved = await this.userRepo.save(user);
    return sanitizeUser(saved);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !verifyPassword(dto.password, user.password)) {
      throw new UnauthorizedException('Email atau password salah');
    }

    return {
      user: sanitizeUser(user),
      message: 'Login berhasil',
    };
  }
}