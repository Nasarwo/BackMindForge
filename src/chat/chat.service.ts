import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { updateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Получает все чаты пользователя
	 * @param userId - ID пользователя
	 */
	async getUserChats(userId: string) {
		return this.prisma.chat.findMany({
			where: { userId },
			orderBy: { updatedAt: 'desc' }, // Сначала новые чаты
			select: {
				id: true,
				title: true,
				neuralNetworkId: true,
				updatedAt: true
			}
		});
	}

	async getAllMessages(chatId: string) {
		return this.prisma.message.findMany({
			where: { chatId },
			orderBy: { createdAt: 'desc' },
			select: {
				content: true,
				role: true,
				createdAt: true
			}
		});
	}

	/**
	 * Создает новый чат с нейросетью
	 * @param userId - ID пользователя
	 * @param neuralNetworkId - ID нейросети
	 */
	async createChat(userId: string, neuralNetworkId: string) {
		// Проверяем, существует ли нейросеть
		const neuralNetwork = await this.prisma.neuralNetwork.findUnique({
			where: { id: neuralNetworkId }
		});

		if (!neuralNetwork) {
			throw new NotFoundException('Neural network not found');
		}

		// Создаем чат
		return this.prisma.chat.create({
			data: {
				userId,
				neuralNetworkId
			},
			include: {
				neuralNetwork: true
			}
		});
	}

	async updateChat(userId: string, chatId: string, dto: updateChatDto) {
		// Проверяем, существует ли нейросеть
		const chat = await this.prisma.chat.findUnique({
			where: { id: chatId }
		});

		if (!chat) {
			throw new NotFoundException('Chat not found');
		}

		// Обновляем title у чата
		return this.prisma.chat.update({
			where: { id: chatId },
			data: { title: dto.title }
		});
	}

	/**
	 * Отправляет сообщение в чат
	 * @param userId - ID пользователя (для проверки доступа)
	 * @param chatId - ID чата
	 * @param dto - Данные сообщения (контент и роль)
	 */
	async sendMessage(userId: string, chatId: string, dto: SendMessageDto) {
		// Проверяем, существует ли чат и принадлежит ли пользователю
		const chat = await this.prisma.chat.findUnique({
			where: { id: chatId }
		});

		if (!chat) {
			throw new NotFoundException('Chat not found');
		}

		if (chat.userId !== userId) {
			throw new UnauthorizedException('You do not have access to this chat');
		}

		// Создаем сообщение
		return this.prisma.message.create({
			data: {
				chatId,
				content: dto.content,
				role: dto.role
			}
		});
	}

	/**
	 * Удаляет чат (опционально)
	 */
	async deleteChat(userId: string, chatId: string) {
		const chat = await this.prisma.chat.findUnique({
			where: { id: chatId }
		});

		if (!chat) {
			throw new NotFoundException('Chat not found');
		}

		if (chat.userId !== userId) {
			throw new UnauthorizedException('You do not have access to this chat');
		}

		return this.prisma.chat.delete({
			where: { id: chatId }
		});
	}
}
