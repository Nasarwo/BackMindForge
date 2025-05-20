import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import cryptoRandomString from 'crypto-random-string';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);
		const tokens = await this.issueTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens
		};
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);
		if (!result) throw new UnauthorizedException('Invalid refresh token');

		const user = await this.prisma.user.findUnique({
			where: {
				id: result.id
			}
		});

		if (!user) throw new UnauthorizedException('User not found');

		const tokens = await this.issueTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens
		};
	}

	async register(dto: AuthDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});

		if (oldUser) throw new BadRequestException('User already exists');

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				code: cryptoRandomString({ length: 6 }),
				name: faker.person.firstName(),
				password: await hash(dto.password)
			}
		});

		// todo: Отправка письма

		const tokens = await this.issueTokens(user.id);

		return {
			user: this.returnUserFields(user),
			...tokens
		};
	}

	private async issueTokens(userId: string) {
		const data = { id: userId };

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		});

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		});

		return { accessToken, refreshToken };
	}

	async checkCode(code: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				code: code
			}
		});

		if (!user) throw new NotFoundException(`Invalid code: ${code}`);

		return this.prisma.user.update({
			where: { code: code },
			data: { emailConfirm: true }
		});
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email
		};
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		});

		if (!user) throw new NotFoundException('User not found');

		const isValid = await verify(user.password, dto.password);

		if (!isValid) throw new UnauthorizedException('Invalid password');

		return user;
	}
}
