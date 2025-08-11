// apps/web/src/state/useGame.ts
import { create } from 'zustand'
import * as Core from '@usp/core' // alias set in vite.config.ts

type Store = {
  state: Core.GameState
  nextWeek: () => void
  doAction: (kind: Core.ActionKind) => void
  meetStakeholder: (id: string) => void
  draftPolicy: (issueId: string, instrument: Core.Instrument) => void
  solveCase: (id: string) => void
  clearLog: () => void

  // File-based saves
  exportSave: () => string
  importSave: (raw: string) => { ok: boolean; error?: string }

  // Quick save/load (localStorage)
  quickSave: () => void
  quickLoad: () => { ok: boolean; error?: string }

  // NEW: endorsements
  requestEndorsement: (id: string) => void
}

const initial = Core.createInitialState()

export const useGameStore = create<Store>((set, get) => ({
  state: initial,

  nextWeek: () => set(s => ({ state: Core.simulateWeek(s.state) })),
  doAction: (kind) => set(s => ({ state: Core.doAction(s.state, kind) })),
  meetStakeholder: (id) => set(s => ({ state: Core.meetStakeholder(s.state, id) })),
  draftPolicy: (issueId, instrument) => set(s => ({ state: Core.draftPolicy(s.state, issueId, instrument) })),
  solveCase: (id) => set(s => ({ state: Core.solveCase(s.state, id) })),
  clearLog: () => set(s => ({ state: { ...s.state, log: [] } })),

  exportSave: () => Core.serialize(get().state),
  importSave: (raw: string) => {
    try {
      const next = Core.deserialize(raw)
      set(() => ({ state: next }))
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Invalid save file' }
    }
  },

  quickSave: () => {
    const json = Core.serialize(get().state)
    try { localStorage.setItem('usp:quickSave', json) } catch {}
  },
  quickLoad: () => {
    try {
      const raw = localStorage.getItem('usp:quickSave')
      if (!raw) return { ok: false, error: 'No quick save found' }
      const next = Core.deserialize(raw)
      set(() => ({ state: next }))
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e?.message ?? 'Quick load failed' }
    }
  },

  // NEW: endorsements
  requestEndorsement: (id) =>
    set(s => ({ state: Core.requestEndorsement(s.state, id) })),
}))


