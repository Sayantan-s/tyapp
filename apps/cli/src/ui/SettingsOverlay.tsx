import React from "react";
import { Box, Text, useInput } from "ink";
import { useTheme } from "../theme/context.js";
import { useAuthStore } from "../store/auth.js";
import { useChatStore } from "../store/chat.js";
import { useUIStore } from "../store/ui.js";

export function SettingsOverlay() {
  const { mode, accent } = useTheme();
  const { handle, fingerprint } = useAuthStore();
  const { setMode } = useChatStore();
  const closeOverlay = useUIStore((s) => s.closeOverlay);

  useInput((_input, key) => {
    if (key.escape) {
      closeOverlay();
    }
    // Toggle mode with 1/2 keys
    if (_input === "1") setMode("CHILL");
    if (_input === "2") setMode("DEV");
  });

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={accent}
      paddingX={2}
      paddingY={1}
    >
      <Box justifyContent="space-between">
        <Text bold>Settings</Text>
        <Text dimColor>[Esc]</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text dimColor bold>
          MODE
        </Text>
        <Box gap={2}>
          <Text color={mode === "CHILL" ? accent : undefined}>
            {mode === "CHILL" ? "●" : "○"} CHILL
          </Text>
          <Text color={mode === "DEV" ? accent : undefined}>
            {mode === "DEV" ? "●" : "○"} DEV
          </Text>
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text dimColor bold>
          IDENTITY
        </Text>
        <Text>
          <Text dimColor>Handle: </Text>
          <Text bold>{handle || "unknown"}</Text>
        </Text>
        <Text>
          <Text dimColor>Key: </Text>
          <Text bold>
            ed25519{" "}
            {fingerprint
              ? `SHA256:${fingerprint.slice(0, 12)}...`
              : "..."}
          </Text>
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text dimColor bold>
          SHORTCUTS
        </Text>
        <Text>
          <Text dimColor>Ctrl+B </Text>
          <Text>Toggle sidebar</Text>
        </Text>
        <Text>
          <Text dimColor>Ctrl+K </Text>
          <Text>Quick channel switch</Text>
        </Text>
        <Text>
          <Text dimColor>Ctrl+M </Text>
          <Text>Toggle mode</Text>
        </Text>
        <Text>
          <Text dimColor>Ctrl+P </Text>
          <Text>Command palette</Text>
        </Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text dimColor bold>
          ABOUT
        </Text>
        <Text dimColor>Terminal-Talk v0.1.0</Text>
      </Box>
    </Box>
  );
}
