import { create } from 'zustand'
import * as Core from '../../../packages/core/src'

type Store = {
  state: Core.GameState
  nextWeek: () => void
  doAction: (kind: Core.ActionKind) => void
  meetStakeholder: (id: string) => void
  draftPolicy: (issueId: string, instrument: Core.Instrument) => void
  solveCase: (id: string) => void
}

const initial = Core.createInitialState()

export const useGameStore = create<Store>((set, get) => ({
  state: initial,
  nextWeek: () => set(s => ({ state: Core.simulateWeek(s.state) })),
  doAction: (kind) => set(s => ({ state: Core.doAction(s.state, kind) })),
  meetStakeholder: (id) => set(s => ({ state: Core.meetStakeholder(s.state, id) })),
  draftPolicy: (issueId, instrument) => set(s => ({ state: Core.draftPolicy(s.state, issueId, instrument) })),
  solveCase: (id) => set(s => ({ state: Core.solveCase(s.state, id) })),
}))
