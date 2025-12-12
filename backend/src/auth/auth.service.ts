import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './user.entity';
import { randomUUID, scryptSync } from 'crypto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async register(
    dto: RegisterUserDto,
  ): Promise<{ message: string; verificationLink: string }> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existing && existing.isVerified) {
      throw new BadRequestException('Email sudah terdaftar.');
    }

    const verificationToken = randomUUID();
    const salt = randomUUID();
    const passwordHash = `${salt}:${scryptSync(dto.password, salt, 64).toString('hex')}`;

    const user = this.userRepository.create({
      id: existing?.id,
      name: dto.name,
      email: dto.email,
      passwordHash,
      isVerified: false,
      verificationToken,
    });

    await this.userRepository.save(user);
    const verificationLink = this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message: 'Registrasi berhasil. Periksa email Anda untuk verifikasi akun.',
      verificationLink,
    };
  }

  async verifyAccount(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Token verifikasi wajib diisi.');
    }

    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new NotFoundException('Token verifikasi tidak valid.');
    }

    if (user.isVerified) {
      return { message: 'Akun sudah terverifikasi.' };
    }

    user.isVerified = true;
    user.verificationToken = null;
    await this.userRepository.save(user);

    return { message: 'Akun berhasil diverifikasi.' };
  }
}