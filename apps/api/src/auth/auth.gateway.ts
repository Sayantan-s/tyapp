import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { type AuthResponse, AuthResponseSchema } from "@repo/types";
import { verifySignature, getFingerprint } from "@repo/crypto";
import { PrismaService } from "../prisma/prisma.service.js";

@WebSocketGateway({ cors: { origin: "*" } })
export class AuthGateway {
  private nonces = new Map<string, { nonce: string; expiresAt: number }>();
  private authenticatedClients = new Map<
    string,
    { handle: string; fingerprint: string }
  >();

  constructor(private readonly prisma: PrismaService) {}

  handleConnection(client: Socket) {
    const nonce = uuidv4();
    const expiresAt = Date.now() + 60000;
    this.nonces.set(client.id, { nonce, expiresAt });
    client.emit("auth_challenge", { nonce, expiresAt });
  }

  handleDisconnect(client: Socket) {
    this.nonces.delete(client.id);
    this.authenticatedClients.delete(client.id);
  }

  isAuthenticated(clientId: string): boolean {
    return this.authenticatedClients.has(clientId);
  }

  getClientInfo(clientId: string) {
    return this.authenticatedClients.get(clientId);
  }

  @SubscribeMessage("auth_verify")
  async handleAuthVerify(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: AuthResponse,
  ) {
    // 1. Validate request shape
    const result = AuthResponseSchema.safeParse(data);
    if (!result.success) {
      client.emit("auth_error", {
        message: "Invalid request format",
        errors: result.error.errors,
      });
      return;
    }

    const { handle, signature, nonce, publicKey } = result.data;

    // 2. Validate nonce
    const challenge = this.nonces.get(client.id);
    if (
      !challenge ||
      challenge.nonce !== nonce ||
      Date.now() > challenge.expiresAt
    ) {
      client.emit("auth_error", { message: "Invalid or expired nonce" });
      return;
    }

    // 3. Verify the signature against the public key
    const verified = verifySignature(nonce, signature, publicKey);
    if (!verified) {
      client.emit("auth_error", { message: "Signature verification failed" });
      return;
    }

    // 4. TOFU: Trust On First Use
    const fingerprint = getFingerprint(publicKey);
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { handle },
      });

      if (existingUser) {
        // User exists — verify they're using the same key
        if (existingUser.pubKey !== publicKey) {
          client.emit("auth_error", {
            message:
              "Public key mismatch. This handle is registered with a different key.",
          });
          return;
        }
        // Update last seen
        await this.prisma.user.update({
          where: { handle },
          data: { lastSeen: new Date() },
        });
      } else {
        // New user — trust on first use
        await this.prisma.user.create({
          data: {
            handle,
            pubKey: publicKey,
          },
        });
      }
    } catch (e) {
      console.error("Database error during auth:", e);
      client.emit("auth_error", { message: "Internal server error" });
      return;
    }

    // 5. Mark as authenticated and clean up nonce
    this.nonces.delete(client.id);
    this.authenticatedClients.set(client.id, { handle, fingerprint });

    client.emit("auth_success", { handle, fingerprint });
    console.log(`[Auth] ${handle} authenticated (fingerprint: ${fingerprint})`);
  }
}
