import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatMessage, AuthChallenge } from "@repo/types";
import {
  getLocalPrivateKey,
  getLocalPublicKey,
  signString,
} from "@repo/crypto";
import { useChatStore } from "../store/chat.js";
import { useAuthStore } from "../store/auth.js";

const SERVER_URL = process.env.TT_SERVER ?? "http://localhost:3002";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const addMessage = useChatStore((s) => s.addMessage);
  const { handle, setAuthenticated, setStep } = useAuthStore();

  useEffect(() => {
    const s = io(SERVER_URL);
    socketRef.current = s;

    s.on("auth_challenge", (challenge: AuthChallenge) => {
      try {
        setStep("authenticating");
        const privKey = getLocalPrivateKey();
        const pubKey = getLocalPublicKey();
        const signature = signString(challenge.nonce, privKey);
        s.emit("auth_verify", {
          handle: handle || "user",
          signature,
          nonce: challenge.nonce,
          publicKey: pubKey,
        });
      } catch {
        setStep("welcome");
      }
    });

    s.on(
      "auth_success",
      (data: { handle: string; fingerprint: string }) => {
        setAuthenticated(data.handle, data.fingerprint);
      },
    );

    s.on("auth_error", (_data: { message: string }) => {
      setStep("welcome");
    });

    s.on("message", (msg: ChatMessage) => {
      addMessage(msg);
    });

    return () => {
      s.disconnect();
    };
  }, [addMessage, handle, setAuthenticated, setStep]);

  return socketRef;
}
