# US Politics Career Sim — Starter

This is a **starter monorepo** for a governance‑first, career simulation game (not just elections).
It includes a web UI, a pure TypeScript core engine, data schemas/samples, tests, and a ready‑to‑use Dev Container.

---

## Quick Start (GitHub Codespaces — easiest)

1. Create a new **private** GitHub repo named `us-politics-career-sim`.
2. Upload the ZIP contents (or push with Git).
3. Click **Code ▸ Create codespace on main**.
4. Wait for the container to finish setup, then run:
   ```bash
   pnpm install
   pnpm dev
   ```
5. Open the forwarded web preview to see the app.

## Quick Start (Local — Windows 10)

1. Install **VS Code** and **Node 20+**.
2. Open terminal and enable pnpm via Corepack:
   ```bash
   corepack enable
   ```
3. In the project folder:
   ```bash
   pnpm install
   pnpm dev
   ```
4. Visit http://localhost:5173

> If `corepack` is unavailable, install pnpm from https://pnpm.io/installation and retry.

---

## What’s inside

- `apps/web` — Vite + React + TypeScript UI (very small shell; calls core engine).
- `packages/core` — Pure TS game engine (**weekly calendar**, **stakeholders**, **favors**, **casework**, **policy** stubs).
- `packages/data` — Zod schemas + **sample JSON** (actors, institutions, issues, district, events).
- `packages/sim-tests` — Vitest tests for the core systems.
- `.devcontainer` — One‑click Codespaces/Dev Container config.

## Useful scripts

- `pnpm dev` — Start the web app.
- `pnpm build` — Build all packages.
- `pnpm typecheck` — Type‑check all workspaces.
- `pnpm test` — Run simulation tests.
- `pnpm validate-data` — Validate JSON samples against schemas.

---

## Folder map

```
apps/web                  # UI shell
packages/core             # Game engine (no DOM)
packages/data             # Schemas + sample data
packages/sim-tests        # Vitest tests
.devcontainer             # Dev environment
tools                     # CLI tools (data validation/utilities)
```

---

## Next steps

- Edit sample JSON under `packages/data` to shape your city/stakeholders.
- Open `packages/core/src/engine/game.ts` to see/modify the weekly loop and actions.
- Use `packages/sim-tests` to lock behaviors (failing tests first, then fix).

For help: see `DESIGN.md` (systems overview), `DATA_FORMAT.md` (JSON fields), and `DEBUG.md` (how to report bugs).
