import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { useTheme } from "../theme/context.js";
import { useChannelStore } from "../store/channels.js";
import { useUIStore } from "../store/ui.js";

export function ChannelBrowser() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const { accent } = useTheme();
  const { channels, setActiveChannel } = useChannelStore();
  const closeOverlay = useUIStore((s) => s.closeOverlay);

  const filtered = channels.filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase()),
  );

  useInput((input, key) => {
    if (key.escape) {
      closeOverlay();
    } else if (key.return) {
      const target = filtered[selected];
      if (target) {
        setActiveChannel(target.name);
        closeOverlay();
      }
    } else if (key.upArrow) {
      setSelected((s) => Math.max(0, s - 1));
    } else if (key.downArrow) {
      setSelected((s) => Math.min(filtered.length - 1, s + 1));
    } else if (key.backspace || key.delete) {
      setSearch((s) => s.slice(0, -1));
    } else if (!key.ctrl && !key.meta && input) {
      setSearch((s) => s + input);
      setSelected(0);
    }
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
        <Text bold>Channels</Text>
        <Text dimColor>[Esc]</Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>{">"} </Text>
        <Text>{search || ""}</Text>
        {!search && <Text dimColor>Search channels...</Text>}
      </Box>

      <Box marginTop={1} flexDirection="column">
        {filtered.map((ch, i) => (
          <Box key={ch.name} justifyContent="space-between">
            <Text
              color={i === selected ? accent : undefined}
              bold={i === selected}
            >
              {i === selected ? "❯ " : "  "}# {ch.name}
            </Text>
            <Box gap={2}>
              <Text dimColor>{ch.online} online</Text>
              {ch.joined && (
                <Text color={accent} bold>
                  joined
                </Text>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text color={accent}>+ Create new channel</Text>
      </Box>
    </Box>
  );
}
