import React from "react";
import { Box } from "ink";
import { useChatStore } from "../store/chat.js";
import { MessageBubble } from "./MessageBubble.js";

export function MessageList() {
  const messages = useChatStore((s) => s.messages);

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1} gap={1}>
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </Box>
  );
}
