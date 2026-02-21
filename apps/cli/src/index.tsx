import React, { useState, useEffect } from "react";
import { render, Box, Text, useInput } from "ink";
import { io, Socket } from "socket.io-client";
import { getLocalPrivateKey, signString } from "@repo/crypto";
import type { ChatMessage, AuthChallenge } from "@repo/types";
import { create } from "zustand";

interface ChatState {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  mode: "CHILL" | "DEV";
  setMode: (mode: "CHILL" | "DEV") => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages.slice(-49), msg] })),
  mode: "CHILL",
  setMode: (mode) => set({ mode }),
}));

const App = () => {
  const [input, setInput] = useState("");
  const { messages, addMessage, mode } = useChatStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    s.on("auth_challenge", (challenge: AuthChallenge) => {
      try {
        const privKey = getLocalPrivateKey();
        const signature = signString(challenge.nonce, privKey);
        s.emit("auth_verify", {
          handle: "user", // Default for now
          signature,
          nonce: challenge.nonce,
        });
        setAuthenticated(true);
      } catch (e) {
        console.error("Auth failed:", e);
      }
    });

    s.on("message", (msg: ChatMessage) => {
      addMessage(msg);
    });

    return () => {
      s.disconnect();
    };
  }, [addMessage]);

  useInput((inputStr, key) => {
    if (key.return) {
      if (socket && input.trim()) {
        const msg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          sender: { handle: "user", publicKeyFingerprint: "..." },
          payload: { type: "TEXT", body: input },
          context: { mode, timestamp: Date.now() },
        };
        socket.emit("message", msg);
        setInput("");
      }
    } else if (key.backspace || key.delete) {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + inputStr);
    }
  });

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="cyan"
    >
      <Box justifyContent="center" marginBottom={1}>
        <Text color="magenta" bold>
          Terminal-Talk (TT) - {mode} MODE
        </Text>
      </Box>

      <Box
        flexDirection="column"
        height={15}
        borderStyle="single"
        borderColor="gray"
      >
        {messages.map((m) => (
          <Box key={m.id}>
            <Text color="yellow">[{m.sender.handle}] </Text>
            <Text>{m.payload.body}</Text>
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text color="green">❯ </Text>
        <Text>{input}</Text>
      </Box>

      {!authenticated && (
        <Box marginTop={1}>
          <Text color="red">Authenticating via SSH...</Text>
        </Box>
      )}
    </Box>
  );
};

render(<App />);
