import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { type ChatMessage, ChatMessageSchema } from "@repo/types";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway {
  @WebSocketServer()
  server: Server | undefined;

  @SubscribeMessage("message")
  handleMessage(@MessageBody() payload: ChatMessage) {
    const result = ChatMessageSchema.safeParse(payload);
    if (!result.success) {
      console.error("Invalid message format:", result.error);
      return;
    }
    // In a real app, verify client is authenticated
    this.server?.emit("message", result.data);
  }
}
