import { clamp } from '../utils/math';
export const meet = (state, actorId) => {
    const actors = state.actors.map(a => a.id === actorId ? { ...a, disposition: clamp(a.disposition + 5, -100, 100), memory: [(a.memory || [])[0] ?? '', 'met'].slice(-3) } : a);
    return { ...state, actors };
};
