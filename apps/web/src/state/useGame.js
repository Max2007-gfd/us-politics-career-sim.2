import { create } from 'zustand';
import * as Core from '@usp/core'; // uses the alias set in vite.config.ts
const initial = Core.createInitialState();
export const useGameStore = create((set) => ({
    state: initial,
    nextWeek: () => set((s) => ({ state: Core.simulateWeek(s.state) })),
    doAction: (kind) => set((s) => ({ state: Core.doAction(s.state, kind) })),
    meetStakeholder: (id) => set((s) => ({ state: Core.meetStakeholder(s.state, id) })),
    draftPolicy: (issueId, instrument) => set((s) => ({ state: Core.draftPolicy(s.state, issueId, instrument) })),
    solveCase: (id) => set((s) => ({ state: Core.solveCase(s.state, id) })),
    clearLog: () => set((s) => ({ state: { ...s.state, log: [] } })),
}));
