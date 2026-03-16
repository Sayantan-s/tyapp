import React from "react";
import { Box, Text } from "ink";

// TODO: Wire up to real presence data from server
const mockUsers = [
  { handle: "alice", online: true },
  { handle: "bob", online: true },
  { handle: "carol", online: false },
];

export function UserList() {
  return (
    <Box flexDirection="column" gap={0}>
      <Text dimColor bold>
        ONLINE
      </Text>
      {mockUsers.map((u) => (
        <Text key={u.handle} dimColor={!u.online}>
          {u.online ? "●" : "○"} {u.handle}
        </Text>
      ))}
    </Box>
  );
}
