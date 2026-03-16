import React from "react";
import { Box, Text } from "ink";
import { useTheme } from "../theme/context.js";
import { useChannelStore } from "../store/channels.js";
import { UserList } from "./UserList.js";

export function Sidebar() {
  const { accent } = useTheme();
  const { channels, activeChannel, setActiveChannel } = useChannelStore();

  return (
    <Box
      flexDirection="column"
      width={20}
      borderStyle="single"
      borderColor="gray"
      borderRight
      borderTop={false}
      borderBottom={false}
      borderLeft={false}
      paddingX={1}
    >
      {/* Channels section */}
      <Box flexDirection="column" gap={0}>
        <Text dimColor bold>
          CHANNELS
        </Text>
        {channels.map((ch) => (
          <Text
            key={ch.name}
            color={ch.name === activeChannel ? accent : undefined}
            bold={ch.name === activeChannel}
            dimColor={ch.name !== activeChannel}
          >
            # {ch.name}
          </Text>
        ))}
        <Text dimColor>+ new</Text>
      </Box>

      {/* Divider */}
      <Box marginY={1}>
        <Text dimColor>────────────────</Text>
      </Box>

      {/* Online users section */}
      <UserList />
    </Box>
  );
}
