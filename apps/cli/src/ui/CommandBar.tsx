import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { Socket } from "socket.io-client";
import type { ChatMessage } from "@repo/types";
import { useTheme } from "../theme/context.js";
import { useAuthStore } from "../store/auth.js";
import { useChatStore } from "../store/chat.js";
import { useCommands } from "../hooks/useCommands.js";
import { useUIStore } from "../store/ui.js";
import { useChannelStore } from "../store/channels.js";

interface CommandBarProps {
  socketRef: React.RefObject<Socket | null>;
}

export function CommandBar({ socketRef }: CommandBarProps) {
  const [input, setInput] = useState("");
  const { accent } = useTheme();
  const { handle, fingerprint } = useAuthStore();
  const mode = useChatStore((s) => s.mode);
  const activeOverlay = useUIStore((s) => s.activeOverlay);
  const activeChannel = useChannelStore((s) => s.activeChannel);
  const { executeCommand, getCompletions } = useCommands();

  useInput((inputStr, key) => {
    // Don't capture input when an overlay is active
    if (activeOverlay !== "none") return;

    if (key.return) {
      if (!input.trim()) return;

      // Try slash command first
      if (executeCommand(input)) {
        setInput("");
        return;
      }

      // Send chat message
      const socket = socketRef.current;
      if (socket) {
        const msg: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          sender: {
            handle: handle || "user",
            publicKeyFingerprint: fingerprint || "...",
          },
          payload: { type: "TEXT", body: input },
          context: {
            mode,
            timestamp: Date.now(),
            metadata: {},
          },
        };
        socket.emit("message", msg);
      }
      setInput("");
    } else if (key.tab) {
      // Autocomplete slash commands
      const completions = getCompletions(input);
      if (completions.length === 1) {
        setInput(completions[0]!);
      }
    } else if (key.backspace || key.delete) {
      setInput((prev) => prev.slice(0, -1));
    } else if (!key.ctrl && !key.meta && inputStr) {
      setInput((prev) => prev + inputStr);
    }
  });

  return (
    <Box paddingX={1}>
      <Text color={accent} bold>
        {">"}{" "}
      </Text>
      <Text>{input || ""}</Text>
      {!input && (
        <Text dimColor>Type a message or /command...</Text>
      )}
    </Box>
  );
}
