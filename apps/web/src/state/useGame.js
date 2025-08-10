import { create } from 'zustand';
import * as Core from '@usp/core'; // alias set in vite.config.ts
const initial = Core.createInitialState();
export const useGameStore = create((set, get) => ({
    state: initial,
    // ---- Core-bridged actions ----
    nextWeek: () => set(s => ({ state: Core.simulateWeek(s.state) })),
    doAction: (kind) => set(s => ({ state: Core.doAction(s.state, kind) })),
    meetStakeholder: (id) => set(s => ({ state: Core.meetStakeholder(s.state, id) })),
    draftPolicy: (issueId, instrument) => set(s => ({ state: Core.draftPolicy(s.state, issueId, instrument) })),
    solveCase: (id) => set(s => ({ state: Core.solveCase(s.state, id) })),
    clearLog: () => set(s => ({ state: { ...s.state, log: [] } })),
    // ---- Saves ----
    exportSave: () => Core.serialize(get().state),
    importSave: (raw) => {
        try {
            const next = Core.deserialize(raw);
            set(() => ({ state: next }));
            return { ok: true };
        }
        catch (e) {
            return { ok: false, error: e?.message ?? 'Invalid save file' };
        }
    },
    quickSave: () => {
        const json = Core.serialize(get().state);
        try {
            localStorage.setItem('usp:quickSave', json);
        }
        catch { }
    },
    quickLoad: () => {
        try {
            const raw = localStorage.getItem('usp:quickSave');
            if (!raw)
                return { ok: false, error: 'No quick save found' };
            const next = Core.deserialize(raw);
            set(() => ({ state: next }));
            return { ok: true };
        }
        catch (e) {
            return { ok: false, error: e?.message ?? 'Quick load failed' };
        }
    },
    // ---- New: structured logs helper (into state.log) ----
    pushLog: ({ level, msg, tag }) => {
        set(s => {
            const now = Date.now();
            const entry = {
                id: Math.random().toString(36).slice(2),
                t: now,
                level,
                msg,
                tag,
            };
            const prevLog = (s.state.log ?? []);
            const nextLog = [entry, ...prevLog].slice(0, 200);
            const nextState = { ...s.state, log: nextLog };
            return { state: nextState };
        });
    },
    // ---- New: Endorsements v1 (lightweight) ----
    askForEndorsement: (id) => {
        const { state } = get();
        const st = state;
        const actors = (st.actors ?? []);
        const idx = actors.findIndex((a) => a?.id === id);
        if (idx === -1) {
            get().pushLog({ level: 'error', msg: `Stakeholder not found: ${id}`, tag: 'endorse' });
            return;
        }
        const a = { ...actors[idx] };
        // Already endorsed?
        if (a.endorsed === true) {
            get().pushLog({ level: 'info', msg: `${a.name} already endorsed you.`, tag: 'endorse' });
            return;
        }
        const disp = Number.isFinite(a.disposition) ? a.disposition : 0;
        const lev = Number.isFinite(a.leverage) ? a.leverage : 0;
        // Soft RNG so it isn't purely deterministic
        const roll = Math.floor(Math.random() * 3); // 0..2
        const score = disp + lev + roll;
        const threshold = 10;
        if (score >= threshold) {
            a.endorsed = true;
            const nextActors = actors.slice();
            nextActors[idx] = a;
            const nextState = {
                ...st,
                actors: nextActors,
                // (Optional) if you want to later surface momentum, uncomment:
                // momentum: Math.max(0, Number(st.momentum ?? 0)) + 2,
            };
            set(() => ({ state: nextState }));
            get().pushLog({ level: 'good', msg: `Endorsement WON from ${a.name}`, tag: 'endorse' });
        }
        else {
            // Small penalty on failed ask
            a.disposition = Math.max(0, disp - 1);
            const nextActors = actors.slice();
            nextActors[idx] = a;
            const nextState = { ...st, actors: nextActors };
            set(() => ({ state: nextState }));
            get().pushLog({ level: 'warn', msg: `Endorsement FAILED with ${a.name} (−1 disposition)`, tag: 'endorse' });
        }
    },
}));
