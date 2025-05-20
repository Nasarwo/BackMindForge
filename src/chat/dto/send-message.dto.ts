import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum MessageRole {
	USER = 'USER',
	ASSISTANT = 'ASSISTANT',
	SYSTEM = 'SYSTEM'
}

export class SendMessageDto {
	@IsString()
	@IsNotEmpty()
	content: string; // Текст сообщения

	@IsEnum(MessageRole)
	role: MessageRole; // Роль отправителя (USER, ASSISTANT, SYSTEM)
}
