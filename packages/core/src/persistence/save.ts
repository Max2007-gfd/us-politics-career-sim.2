import type { GameState } from '../engine/game'

export const serialize = (s: GameState) => JSON.stringify(s)
export const deserialize = (raw: string) => JSON.parse(raw) as GameState
