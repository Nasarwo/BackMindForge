import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, ChatModule, UserModule, MailModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
