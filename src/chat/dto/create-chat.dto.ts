import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
	@IsString()
	@IsNotEmpty()
	neuralNetworkId: string; // ID нейросети, с которой создается чат
}
