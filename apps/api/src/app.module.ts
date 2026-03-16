import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat/chat.gateway.js";
import { AuthGateway } from "./auth/auth.gateway.js";
import { PrismaService } from "./prisma/prisma.service.js";
import { ConfigModule } from "@nestjs/config";
import config from "./config/settings.js";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [config] })],
  controllers: [],
  providers: [AuthGateway, ChatGateway, PrismaService],
})
export class AppModule {}
