import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat/chat.gateway.js";
import { AuthGateway } from "./auth/auth.gateway.js";

@Module({
  imports: [],
  controllers: [],
  providers: [AuthGateway, ChatGateway],
})
export class AppModule {}
