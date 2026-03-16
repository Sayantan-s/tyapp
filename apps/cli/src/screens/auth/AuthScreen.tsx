import React, { useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { getLocalPublicKey, getFingerprint } from "@repo/crypto";
import { useAuthStore } from "../../store/auth.js";

export function AuthScreen() {
  const { step, handle, setStep, setHandle } = useAuthStore();

  // Auto-detect SSH key on mount
  useEffect(() => {
    if (step === "detecting") {
      try {
        getLocalPublicKey();
        setStep("handle-input");
      } catch {
        // No key found, stay on detecting step
      }
    }
  }, [step, setStep]);

  useInput((input, key) => {
    if (step === "welcome" && key.return) {
      setStep("detecting");
    }

    if (step === "handle-input") {
      if (key.return && handle.trim()) {
        setStep("authenticating");
      } else if (key.backspace || key.delete) {
        setHandle(handle.slice(0, -1));
      } else if (!key.ctrl && !key.meta && input && !key.return) {
        setHandle(handle + input);
      }
    }
  });

  let keyFingerprint = "";
  try {
    const pubKey = getLocalPublicKey();
    keyFingerprint = getFingerprint(pubKey);
  } catch {
    // ignore
  }

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      gap={1}
    >
      <Text bold color="cyan">
        ◉ Terminal-Talk
      </Text>

      {step === "welcome" && (
        <>
          <Box flexDirection="column" alignItems="center">
            <Text dimColor>real-time chat over SSH.</Text>
            <Text dimColor>no passwords. no accounts.</Text>
            <Text dimColor>just your keys.</Text>
          </Box>
          <Text dimColor>Press Enter to begin...</Text>
        </>
      )}

      {step === "detecting" && (
        <Box flexDirection="column" alignItems="center">
          <Text dimColor>◐ Detecting SSH keys...</Text>
        </Box>
      )}

      {step === "handle-input" && (
        <Box flexDirection="column" alignItems="center" gap={1}>
          <Text color="green">
            ✓ Found ed25519 key
          </Text>
          {keyFingerprint && (
            <Text dimColor>
              SHA256:{keyFingerprint.slice(0, 16)}...
            </Text>
          )}
          <Box>
            <Text dimColor>Choose a handle: </Text>
            <Text color="cyan">{handle}</Text>
            <Text color="cyan">_</Text>
          </Box>
          <Text dimColor>Enter to continue</Text>
        </Box>
      )}

      {step === "authenticating" && (
        <Box flexDirection="column" alignItems="center">
          <Text>Authenticating...</Text>
          <Text color="yellow">◐ Signing challenge</Text>
          <Text dimColor>○ Verifying identity</Text>
        </Box>
      )}

      {step === "success" && (
        <Box flexDirection="column" alignItems="center">
          <Text color="green">
            Welcome, {handle} ✓
          </Text>
          <Text dimColor>Entering #general...</Text>
        </Box>
      )}
    </Box>
  );
}
