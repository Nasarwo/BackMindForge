import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				transport: {
					service: 'gmail',
					auth: {
						user: configService.get('GMAIL_USER'),
						pass: configService.get('GMAIL_APP_PASSWORD')
					}
				},
				defaults: {
					from: `"No Reply" <${configService.get('MAIL_FROM')}>`
				}
			}),
			inject: [ConfigService]
		})
	],
	controllers: [MailController],
	providers: [MailService, PrismaService, ConfigService],
	exports: [MailService, PrismaService, ConfigService]
})
export class MailModule {}
