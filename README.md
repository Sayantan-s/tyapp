# 💬 tyapp

### 📝 project overview

`tyapp` (Terminal Talk) is a real-time, terminal-based messaging platform built with a focus on security and developer experience. It features a headless CLI client powered by Ink and a robust NestJS backend. Leveraging public-key cryptography for seamless authentication, it provides a unique "chill" or "dev" mode environment for terminal enthusiasts.

### 🛠️ tools

&nbsp;<img src="https://cdn.svgporn.com/logos/typescript-icon.svg" width="48" alt="typescript">
&nbsp;<img src="https://cdn.svgporn.com/logos/nestjs.svg" width="48" alt="nestjs">
&nbsp;<img src="https://cdn.svgporn.com/logos/prisma.svg" width="38" alt="prisma">
&nbsp;<img src="https://cdn.svgporn.com/logos/postgresql.svg" width="48" alt="postgresql">
&nbsp;<img src="https://cdn.svgporn.com/logos/socket.io.svg" width="48" alt="socket.io">
&nbsp;<img src="https://cdn.svgporn.com/logos/turborepo-icon.svg" width="48" alt="turbo">
&nbsp;<img src="https://cdn.svglogos.dev/logos/yarn.svg" width="48" alt="yarn">

### 🚀 getting started

This project is managed as a monorepo using **Turborepo** and **Yarn Workspaces**.

1.  **Install dependencies:**

    ```bash
    yarn install
    ```

2.  **Set up the database:**
    Ensure you have a PostgreSQL instance running and configure your connection in `apps/api/prisma/schema.prisma` or via environment variables. Then run:

    ```bash
    yarn turbo run postinstall --filter=api
    ```

3.  **Run in development mode:**

    ```bash
    # Start both API and CLI
    yarn dev

    # Start specific workspace
    yarn turbo dev --filter=api
    yarn turbo dev --filter=cli
    ```

### 🏗️ architecture

- `apps/api`: NestJS backend handling real-time communication via WebSockets and persistence with Prisma.
- `apps/cli`: Interactive terminal UI built with React and Ink.
- `packages/crypto`: Shared utilities for public-key signing and verification.
- `packages/types`: Shared TypeScript definitions across the monorepo.
- `packages/typescript-config`: Centralized configuration for the TypeScript compiler.
