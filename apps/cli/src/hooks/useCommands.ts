import { useUIStore } from "../store/ui.js";
import { useChannelStore } from "../store/channels.js";

interface Command {
  name: string;
  description: string;
  execute: () => void;
}

export function useCommands() {
  const { setOverlay } = useUIStore();
  const { setActiveChannel, addChannel } = useChannelStore();

  const commands: Command[] = [
    {
      name: "/channels",
      description: "Open channel browser",
      execute: () => setOverlay("channels"),
    },
    {
      name: "/settings",
      description: "Open settings",
      execute: () => setOverlay("settings"),
    },
    {
      name: "/help",
      description: "Show all commands",
      execute: () => setOverlay("command-palette"),
    },
  ];

  function executeCommand(input: string): boolean {
    const trimmed = input.trim();
    if (!trimmed.startsWith("/")) return false;

    const parts = trimmed.split(" ");
    const cmd = parts[0];
    const arg = parts.slice(1).join(" ");

    // Built-in commands
    const match = commands.find((c) => c.name === cmd);
    if (match) {
      match.execute();
      return true;
    }

    // Parameterized commands
    if (cmd === "/join" && arg.startsWith("#")) {
      setActiveChannel(arg.slice(1));
      return true;
    }

    if (cmd === "/create" && arg.startsWith("#")) {
      const name = arg.slice(1);
      addChannel({ name, online: 0, joined: true });
      setActiveChannel(name);
      return true;
    }

    return false;
  }

  function getCompletions(partial: string): string[] {
    if (!partial.startsWith("/")) return [];
    return commands
      .filter((c) => c.name.startsWith(partial))
      .map((c) => c.name);
  }

  return { commands, executeCommand, getCompletions };
}
