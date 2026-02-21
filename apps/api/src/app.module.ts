import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat/chat.gateway.js";
import { AuthGateway } from "./auth/auth.gateway.js";
import { PrismaService } from "./prisma/prisma.service.js";

@Module({
  imports: [],
  controllers: [],
  providers: [AuthGateway, ChatGateway, PrismaService],
})
export class AppModule {}
