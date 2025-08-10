import type { Actor } from '../types/entities'
import { clamp } from '../utils/math'

export type StakeholderState = {
  actors: Actor[]
}

export const meet = (state: StakeholderState, actorId: string): StakeholderState => {
  const actors = state.actors.map(a => a.id === actorId ? { ...a, disposition: clamp(a.disposition + 5, -100, 100), memory: [(a.memory||[])[0] ?? '', 'met'].slice(-3) } : a)
  return { ...state, actors }
}
