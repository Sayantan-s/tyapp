import React from "react";
import { Box } from "ink";
import { Socket } from "socket.io-client";
import { StatusBar } from "../../ui/StatusBar.js";
import { MessageList } from "../../ui/MessageList.js";
import { CommandBar } from "../../ui/CommandBar.js";
import { Sidebar } from "../../ui/Sidebar.js";
import { SettingsOverlay } from "../../ui/SettingsOverlay.js";
import { ChannelBrowser } from "../../ui/ChannelBrowser.js";
import { CommandPalette } from "../../ui/CommandPalette.js";
import { useUIStore } from "../../store/ui.js";
import { useKeyboard } from "../../hooks/useKeyboard.js";

interface ChatScreenProps {
  socketRef: React.RefObject<Socket | null>;
}

export function ChatScreen({ socketRef }: ChatScreenProps) {
  const { sidebarVisible, activeOverlay } = useUIStore();
  useKeyboard();

  // If an overlay is active, show it instead of normal chat
  if (activeOverlay === "settings") {
    return <SettingsOverlay />;
  }

  if (activeOverlay === "channels") {
    return <ChannelBrowser />;
  }

  if (activeOverlay === "command-palette") {
    return <CommandPalette />;
  }

  return (
    <Box flexDirection="column" height="100%">
      <StatusBar />

      <Box flexGrow={1}>
        {sidebarVisible && <Sidebar />}
        <MessageList />
      </Box>

      <CommandBar socketRef={socketRef} />
    </Box>
  );
}
