import React from "react";
import { Box, Text } from "ink";
import { useTheme } from "../theme/context.js";
import { useAuthStore } from "../store/auth.js";
import { useChannelStore } from "../store/channels.js";
import { ModePill } from "./ModePill.js";

export function StatusBar() {
  const { accent } = useTheme();
  const { handle, fingerprint } = useAuthStore();
  const activeChannel = useChannelStore((s) => s.activeChannel);
  const channels = useChannelStore((s) => s.channels);
  const current = channels.find((c) => c.name === activeChannel);

  return (
    <Box justifyContent="space-between" paddingX={1}>
      <Box gap={2}>
        <Text bold color={accent}>
          ◉ TT
        </Text>
        <Text dimColor>#{activeChannel}</Text>
        <ModePill />
      </Box>
      <Box gap={2}>
        {current && <Text dimColor>{current.online} online</Text>}
        <Text dimColor>
          {handle}@{fingerprint ? fingerprint.slice(0, 8) : "..."}
        </Text>
      </Box>
    </Box>
  );
}
