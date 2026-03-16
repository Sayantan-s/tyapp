import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { useTheme } from "../theme/context.js";
import { useUIStore } from "../store/ui.js";
import { useCommands } from "../hooks/useCommands.js";

export function CommandPalette() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(0);
  const { accent } = useTheme();
  const closeOverlay = useUIStore((s) => s.closeOverlay);
  const { commands } = useCommands();

  const filtered = commands.filter(
    (c) =>
      c.name.includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  useInput((input, key) => {
    if (key.escape) {
      closeOverlay();
    } else if (key.return) {
      const target = filtered[selected];
      if (target) {
        closeOverlay();
        target.execute();
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
        <Text bold>Command Palette</Text>
        <Text dimColor>[Esc]</Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>{">"} </Text>
        <Text>{search || ""}</Text>
        {!search && <Text dimColor>Search commands...</Text>}
      </Box>

      <Box marginTop={1} flexDirection="column">
        {filtered.map((cmd, i) => (
          <Box key={cmd.name} gap={2}>
            <Text
              color={i === selected ? accent : undefined}
              bold={i === selected}
            >
              {i === selected ? "❯" : " "} {cmd.name}
            </Text>
            <Text dimColor>{cmd.description}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
