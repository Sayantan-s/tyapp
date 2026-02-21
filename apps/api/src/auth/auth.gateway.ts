import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { type AuthResponse, AuthResponseSchema } from "@repo/types";

@WebSocketGateway({ cors: { origin: "*" } })
export class AuthGateway {
  private nonces = new Map<string, { nonce: string; expiresAt: number }>();

  handleConnection(client: Socket) {
    const nonce = uuidv4();
    const expiresAt = Date.now() + 60000;
    this.nonces.set(client.id, { nonce, expiresAt });
    client.emit("auth_challenge", { nonce, expiresAt });
  }

  @SubscribeMessage("auth_verify")
  handleAuthVerify(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AuthResponse,
  ) {
    const result = AuthResponseSchema.safeParse(data);
    if (!result.success) {
      client.emit("auth_error", {
        message: "Invalid request format",
        errors: result.error.errors,
      });
      return;
    }

    const validatedData = result.data;
    const challenge = this.nonces.get(client.id);
    if (
      !challenge ||
      challenge.nonce !== validatedData.nonce ||
      Date.now() > challenge.expiresAt
    ) {
      client.emit("auth_error", { message: "Invalid or expired nonce" });
      return;
    }

    // For MVP: First time user connects, we trust their public key (TOFU)
    // In reality, you'd verify against a registry
    // For this simulation, we'll expect the client to send their public key or have it pre-stored
    // Let's assume the client sends the public key for the first time
    // (In a real scenario, this would be more secure)
  }
}
