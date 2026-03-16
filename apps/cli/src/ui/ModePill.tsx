import React from "react";
import { Box, Text } from "ink";
import { useTheme } from "../theme/context.js";

export function ModePill() {
  const { mode, accent } = useTheme();

  return (
    <Box>
      <Text color={accent} bold>
        {mode}
      </Text>
    </Box>
  );
}
