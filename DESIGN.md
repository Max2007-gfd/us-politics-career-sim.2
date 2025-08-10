# Design Overview (v0.1.0)

**Goal:** A career sim where governing, relationships, and favors matter more than elections.

## Pillars
- From Nobody to Network
- Institutions Matter
- Time & Timing
- Governance > Campaigning

## Core Loop (between elections)
- Weekly calendar with time blocks.
- Work stakeholder map for relationships and favors.
- Advance initiatives (policy pipeline: draft→committee→floor).
- Manage constituent services for Goodwill.
- Handle opportunities (vacancies/appointments) when they appear.

## Systems in this starter
- **Calendar:** time blocks with cooldowns.
- **Stakeholders:** relationship score, leverage tag, ask memory.
- **Favors:** earn/spend chips; decay; caps.
- **Casework:** ticket queue → Goodwill.
- **Policy (stub):** difficulty, cost, controversy → committee gate → floor gate.
- **Opportunity (stub):** occasional events unlocked by thresholds.
- **Risk:** integrity trades that influence scandal chance (stubbed).

## Data
Zod-validated JSON files under `packages/data`:
- `actors.sample.json`, `institutions.sample.json`, `issues.sample.json`, `district.sample.json`, `events.sample.json`

## Dev notes
- The **core engine** is DOM-free and deterministic with a **seeded RNG** (`rng.ts`).
- `engine/game.ts` is the orchestrator: it advances weeks, applies actions, and logs state changes.
- UI uses Zustand to call core functions and render results.
