import React, { useEffect } from "react";
import { Box } from "ink";
import { ThemeContext } from "./theme/context.js";
import { colors } from "./theme/colors.js";
import { useAuthStore } from "./store/auth.js";
import { useChatStore } from "./store/chat.js";
import { useSocket } from "./hooks/useSocket.js";
import { AuthScreen } from "./screens/auth/AuthScreen.js";
import { ChatScreen } from "./screens/chat/ChatScreen.js";

export function App() {
  const { authenticated, step } = useAuthStore();
  const mode = useChatStore((s) => s.mode);
  const socketRef = useSocket();

  const themeValue = {
    mode,
    accent: colors.accent[mode],
  };

  // Transition from success screen to chat after a short delay
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        // Auth store already has authenticated=true from setAuthenticated
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <Box flexDirection="column" height="100%">
        {authenticated ? (
          <ChatScreen socketRef={socketRef} />
        ) : (
          <AuthScreen />
        )}
      </Box>
    </ThemeContext.Provider>
  );
}
