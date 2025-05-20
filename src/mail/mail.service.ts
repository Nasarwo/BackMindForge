import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private prisma: PrismaService,
		private readonly configService: ConfigService
	) {}

	async sendEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) throw new NotFoundException("User isn't exists");

		const link = `http://${this.configService.get('HOST')}:4200/api/auth/${user.code}`;

		await this.mailerService.sendMail({
			to: email,
			subject: 'Подтверждение регистрации',
			html: `
        <p>Для подтверждения email перейдите по ссылке:</p>
        <p><a href="${link}">${link}</a></p>`
		});
	}
}
