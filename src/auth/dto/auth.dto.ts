import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
	@IsEmail()
	email: string;

	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@MaxLength(20, {
		message: 'Password must be smaller then 20 characters'
	})
	@IsString()
	password: string;
}
