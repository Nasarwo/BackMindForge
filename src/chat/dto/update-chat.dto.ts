import { IsNotEmpty, IsString } from 'class-validator';

export class updateChatDto {
	@IsString()
	@IsNotEmpty()
	title: string;
}
