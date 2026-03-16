import React from "react";
import { Box, Text } from "ink";
import type { ChatMessage } from "@repo/types";
import { useTheme } from "../theme/context.js";

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const { accent } = useTheme();

  // System messages
  if (message.payload.type === "SYSTEM") {
    return (
      <Box justifyContent="center" paddingY={0}>
        <Text dimColor>─── {message.payload.body} ───</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box gap={1}>
        <Text color={accent} bold>
          {message.sender.handle}
        </Text>
        <Text dimColor>· {timeAgo(message.context.timestamp)}</Text>
      </Box>
      <Text wrap="wrap">{message.payload.body}</Text>
      {message.payload.type === "CODE" && message.payload.language && (
        <Box
          borderStyle="single"
          borderColor="gray"
          paddingX={1}
          marginTop={0}
        >
          <Text color="gray">{message.payload.body}</Text>
        </Box>
      )}
    </Box>
  );
}
