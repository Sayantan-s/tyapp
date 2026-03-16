# Terminal-Talk (TT) — UI Design Specification

## Overview

Terminal-Talk is a real-time terminal-based messaging app with SSH public-key authentication. This spec defines the complete UI design system for the CLI client built with React/Ink.

---

## Color System & Mode Theming

### Shared Dark Base

| Token          | Value              | Description    |
| -------------- | ------------------ | -------------- |
| Background     | `#0A0F1C`          | Deep navy      |
| Surface        | `#1E293B`          | Slate 800      |
| Inset          | `#0F172A`          | Slate 900      |
| Text Primary   | `#FFFFFF`          |                |
| Text Secondary | `#94A3B8`          | Slate 400      |
| Text Muted     | `#64748B`          | Slate 500      |
| Borders        | `#0F172A`          |                |

### Mode Accents

| Mode  | Color     | Hex       | Feel                    |
| ----- | --------- | --------- | ----------------------- |
| CHILL | Warm amber | `#F59E0B` | Relaxed, conversational |
| DEV   | Electric cyan | `#22D3EE` | Focused, technical   |

### Typography

- **Monospace:** handles, timestamps, code blocks, command bar, status indicators
- **Sans-serif (where supported):** message bodies, section labels, descriptions

---

## Screen Architecture

Collapsible sidebar layout:

- **Default:** sidebar hidden, chat full width
- **Ctrl+B** toggles sidebar (channels + online users on left ~20%)
- **Top:** status bar (app name, channel, mode pill, user identity)
- **Center:** scrollable message list
- **Bottom:** command bar with `/` prefix for slash commands

---

## Screens

### 1. Auth/Onboarding (full-screen centered)

- **Step 1: Welcome** — app name, tagline ("real-time chat over SSH. no passwords. no accounts. just your keys."), "Press Enter to begin"
- **Step 2: SSH key detection** — auto-detect ed25519/rsa, show fingerprint, handle input prompt
- **Step 3: Authenticating** — terminal progress indicators (`✓` done, `◐` in progress, `○` pending)
- **Step 4: Success** — "Welcome, {handle} ✓", transition to `#general`

### 2. Main Chat (sidebar hidden — default)

- Full-width status bar: `◉ TT  #general  CHILL ●  3 online`
- Message area with minimal bubbles:
  - Handle (accent color, monospace) + relative timestamp (muted)
  - Body text (white) on next line
  - Code blocks: `#0F172A` background, rounded corners, language tag
  - System messages: centered, muted, no bubble
  - Reactions: inline below body
- Command bar at bottom: `> _` prompt

### 3. Main Chat (sidebar visible)

- **Left sidebar (~20% width):**
  - `CHANNELS` section: list of joined channels, `+` new action
  - Divider
  - `ONLINE` section: user list with presence dots (`●` online, `○` offline)
- **Right:** same chat area, narrower

### 4. Settings Overlay (`/settings` or `Ctrl+,`)

- Slides over chat area
- Sections: Mode toggle (CHILL/DEV), Identity (handle + key fingerprint), Shortcuts reference, About

### 5. Channel Browser (`/channels` or `Ctrl+K`)

- Floating modal with fuzzy search input
- Channel list: name, online count, joined status
- `+ Create new channel` action

---

## Message Types

| Type     | Rendering                                                              |
| -------- | ---------------------------------------------------------------------- |
| TEXT     | Handle + timestamp, body below                                         |
| CODE     | Body + fenced code block with `#0F172A` bg, language tag               |
| SYSTEM   | Centered, muted, no bubble (e.g., "alice joined #general")            |
| REACTION | Emoji counts inline below message body                                 |

---

## Keyboard Shortcuts

| Shortcut      | Action                                   |
| ------------- | ---------------------------------------- |
| `Ctrl+B`      | Toggle sidebar                           |
| `Ctrl+K`      | Quick channel switcher (fuzzy search)    |
| `Ctrl+U`      | Toggle user list panel                   |
| `Ctrl+M`      | Toggle CHILL/DEV mode                    |
| `Esc`         | Close any overlay/panel                  |
| `↑` / `↓`    | Scroll message history                   |
| `Ctrl+E`      | Edit last sent message                   |
| `Ctrl+R`      | Reply to highlighted message             |
| `Ctrl+L`      | Clear chat view                          |
| `Enter`       | Send message                             |
| `Shift+Enter` | Newline in message                       |
| `Tab`         | Autocomplete slash command / mention     |
| `@ + Tab`     | Autocomplete user mention                |
| `Ctrl+F`      | Search messages in channel               |
| `Ctrl+I`      | Show channel/room info                   |
| `Ctrl+P`      | Command palette                          |
| `Ctrl+,`      | Open settings                            |
| `Ctrl+Q`      | Quit                                     |
| `?`           | Show shortcut help (input empty)         |

---

## Slash Commands

| Command         | Action                |
| --------------- | --------------------- |
| `/channels`     | Open channel browser  |
| `/users`        | Show online users     |
| `/settings`     | Open settings overlay |
| `/mode`         | Toggle CHILL/DEV      |
| `/join #name`   | Join a channel        |
| `/create #name` | Create a channel      |
| `/help`         | Show all commands     |

---

## Component Architecture

File structure for `apps/cli/src/`:

```
index.tsx                        — Entry point
app.tsx                          — App shell with router
theme/
  colors.ts                      — Color tokens & palette
  context.ts                     — Theme context provider
store/
  chat.ts                        — Chat messages state
  auth.ts                        — Auth flow state
  ui.ts                          — UI toggles (sidebar, overlays)
  channels.ts                    — Channel list & active channel
hooks/
  useSocket.ts                   — Socket.io connection lifecycle
  useAuth.ts                     — SSH key detection & challenge flow
  useKeyboard.ts                 — Global keyboard shortcut handler
  useCommands.ts                 — Slash command parser & dispatcher
screens/
  auth/AuthScreen.tsx            — Onboarding / authentication flow
  chat/ChatScreen.tsx            — Main chat view
ui/
  StatusBar.tsx                  — Top bar (app name, channel, mode, online count)
  CommandBar.tsx                 — Bottom input bar with slash command support
  Sidebar.tsx                    — Collapsible channels + users panel
  MessageList.tsx                — Scrollable message feed
  MessageBubble.tsx              — Individual message rendering
  ChannelBrowser.tsx             — Fuzzy-search channel modal
  SettingsOverlay.tsx            — Settings slide-over panel
  UserList.tsx                   — Online/offline user list
  ModePill.tsx                   — CHILL/DEV mode indicator
  CommandPalette.tsx             — Ctrl+P command palette
modes/
  chill/theme.ts                 — Amber accent theme (#F59E0B)
  dev/theme.ts                   — Cyan accent theme (#22D3EE)
```
