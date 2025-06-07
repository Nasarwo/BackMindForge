import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.enableCors({
		origin: true, // или '*' для всех, но без учёта credentials
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: 'Content-Type,Authorization',
		credentials: true // если нужны куки/авторизация
	});
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true, // Отсекает лишние поля
			forbidNonWhitelisted: true // Бросает ошибку, если есть лишние поля
		})
	);
	await app.listen(4200, '0.0.0.0');
}
bootstrap();
