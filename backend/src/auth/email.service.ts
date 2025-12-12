import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  private getVerificationLink(token: string): string {
    const frontendBaseUrl =
      this.configService.get<string>('FRONTEND_BASE_URL') ||
      'http://localhost:3000';
    return `${frontendBaseUrl}/verify?token=${token}`;
  }

  sendVerificationEmail(to: string, token: string): string {
    const link = this.getVerificationLink(token);
    const from =
      this.configService.get<string>('EMAIL_FROM') || 'no-reply@example.com';

    this.logger.log(
      `Mengirim email verifikasi ke ${to} dari ${from} dengan tautan: ${link}`,
    );

    return link;
  }
}