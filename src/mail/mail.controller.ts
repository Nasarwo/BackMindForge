import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailDto } from './dto/email.dto';
import { Response } from 'express';

@Controller('mail')
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@Post('send')
	async sendEmail(@Res() res: Response, @Body() dto: EmailDto) {
		try {
			await this.mailService.sendEmail(dto.email);

			return res.status(HttpStatus.OK).json({
				status: 'success',
				message: 'Письмо успешно отправлено'
			});
		} catch (error) {
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: 'error',
				message: 'Не удалось отправить письмо',
				error: error.message
			});
		}
	}
}
