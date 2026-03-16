import { useInput } from "ink";
import { useUIStore } from "../store/ui.js";
import { useChatStore } from "../store/chat.js";

export function useKeyboard() {
  const { toggleSidebar, setOverlay, closeOverlay, activeOverlay } =
    useUIStore();
  const { mode, setMode } = useChatStore();

  useInput((_input, key) => {
    // Esc: close any overlay
    if (key.escape) {
      if (activeOverlay !== "none") {
        closeOverlay();
        return;
      }
    }

    // Ctrl shortcuts only work when no overlay is active
    if (activeOverlay !== "none") return;

    if (key.ctrl) {
      switch (_input) {
        case "b":
          toggleSidebar();
          break;
        case "k":
          setOverlay("channels");
          break;
        case "m":
          setMode(mode === "CHILL" ? "DEV" : "CHILL");
          break;
        case "p":
          setOverlay("command-palette");
          break;
        case "l":
          useChatStore.getState().clearMessages();
          break;
      }
    }
  });
}
