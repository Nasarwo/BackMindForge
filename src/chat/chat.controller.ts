import {
	Controller,
	UseGuards,
	Request,
	Get,
	Body,
	Post,
	Param,
	Patch
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { updateChatDto } from './dto/update-chat.dto';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	async getUserChats(@Request() req) {
		const userId = req.user.id; // Теперь `user` добавляется автоматически через JwtStrategy
		return this.chatService.getUserChats(userId);
	}

	@Post()
	async createChat(@Request() req, @Body() dto: CreateChatDto) {
		const userId = req.user.id;
		return this.chatService.createChat(userId, dto.neuralNetworkId);
	}

	@Patch(':chatId')
	async updateNameChat(
		@Request() req,
		@Param('chatId') chatId: string,
		@Body() dto: updateChatDto
	) {
		const userId = req.user.id;
		return this.chatService.updateChat(userId, chatId, dto);
	}

	@Post(':chatId/messages')
	async sendMessage(
		@Request() req,
		@Param('chatId') chatId: string,
		@Body() dto: SendMessageDto
	) {
		const userId = req.user.id;
		return this.chatService.sendMessage(userId, chatId, dto);
	}
}
